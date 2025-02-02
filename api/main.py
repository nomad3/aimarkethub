from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi_limiter.depends import RateLimiter
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

@router.post("/process", dependencies=[Depends(RateLimiter(times=10, seconds=60))])
async def enqueue_processing(paper_id: int, db=Depends(get_db)):
    """Endpoint para encolar procesamiento con rate limiting"""
    exists = db.execute("SELECT id FROM papers WHERE id = %s", (paper_id,)).fetchone()
    if not exists:
        raise HTTPException(404, "Paper not found")
    
    worker.process_paper_task.delay(paper_id)
    return {"status": "queued"}

@router.get("/papers")
async def list_papers(
    page: int = 1, 
    min_score: float = 7.0,
    db=Depends(get_db)
):
    """Endpoint paginado con filtro de score mínimo"""
    offset = (page - 1) * 20
    return db.execute("""
        SELECT id, title, market_score 
        FROM papers 
        WHERE market_score >= %s
        ORDER BY market_score DESC
        LIMIT 20 OFFSET %s
    """, (min_score, offset)).fetchall()

@router.get("/papers/{paper_id}")
async def get_paper_details(
    paper_id: int,
    db=Depends(get_db),
    # user: dict = Depends(get_current_user)
):
    """Endpoint enriquecido con más metadata"""
    paper = db.execute("""
        SELECT p.*, 
               (SELECT COUNT(*) FROM user_favorites WHERE paper_id = p.id) as favorites_count
        FROM papers p
        WHERE p.id = %s
    """, (paper_id,)).fetchone()
    
    return {
        **paper,
        "similar_papers": db.execute("""
            SELECT id, title, market_score 
            FROM papers 
            WHERE id != %s 
            ORDER BY market_score DESC 
            LIMIT 5
        """, (paper_id,)).fetchall()
    }

@router.get("/admin/metrics", dependencies=[Depends(RateLimiter(times=5, seconds=60))])
async def get_admin_metrics(user: dict = Depends(get_current_user)):
    """Endpoint para métricas administrativas"""
    if not user.get('is_admin'):
        raise HTTPException(403, "Forbidden")
    
    return {
        "total_papers": db.execute("SELECT COUNT(*) FROM papers").fetchone()[0],
        "avg_processing_time": db.execute("""
            SELECT AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) 
            FROM celery_taskmeta
        """).fetchone()[0],
        "top_scores": db.execute("""
            SELECT title, market_score 
            FROM papers 
            ORDER BY market_score DESC 
            LIMIT 5
        """).fetchall()
    }

@router.get("/admin/users")
async def list_users(
    page: int = 1,
    db=Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Lista paginada de usuarios con filtros"""
    if not user.get('is_admin'):
        raise HTTPException(403, "Forbidden")
    
    offset = (page - 1) * 20
    return db.execute("""
        SELECT id, email, created_at, is_active 
        FROM users 
        ORDER BY created_at DESC
        LIMIT 20 OFFSET %s
    """, (offset,)).fetchall()

app.include_router(router, prefix="/api/v1")

# Mejorar manejo de conexiones DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 