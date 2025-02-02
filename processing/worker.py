import os
from celery import Celery
from redis import Redis
from analyzer import PaperAnalyzer
from api.database import get_db  # Acceso cruzado entre servicios

app = Celery('tasks', broker='redis://redis:6379/0')
analyzer = PaperAnalyzer()
redis_conn = Redis(host='redis', port=6379)

@app.task(bind=True, max_retries=3)
def process_paper_task(self, paper_id):
    try:
        db = next(get_db())
        paper = db.execute("SELECT * FROM papers WHERE id = %s", (paper_id,)).fetchone()
        
        # Cache temporal para evitar reprocesamiento
        if redis_conn.get(f"processing:{paper_id}"):
            return
        redis_conn.setex(f"processing:{paper_id}", 3600, "1")

        # Procesamiento en chunks
        summary = analyzer.generate_summary(paper['abstract'])
        market_score = analyzer.calculate_market_potential(paper['abstract'])
        
        db.execute("""
            UPDATE papers 
            SET summary = %s, market_score = %s 
            WHERE id = %s
        """, (summary, market_score, paper_id))
        db.commit()

    except Exception as e:
        self.retry(exc=e, countdown=2 ** self.request.retries) 