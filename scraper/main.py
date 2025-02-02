import time
from tenacity import retry, wait_exponential, stop_after_attempt
import arxiv
from pydantic import BaseModel  # Add data validation

# Data model for validation
class PaperSchema(BaseModel):
    title: str
    abstract: str
    authors: list[str]
    pdf_url: str

class PaperScraper:
    def __init__(self):
        self.sources = ['arxiv', 'pubmed']
        self.request_delay = 5  # Seconds between requests
        self.last_request_time = 0
        
    @retry(wait=wait_exponential(multiplier=1, min=4, max=10), 
           stop=stop_after_attempt(3))
    def fetch_from_arxiv(self, keywords):
        """Fetch papers with retry logic and rate limiting"""
        time_since_last = time.time() - self.last_request_time
        if time_since_last < self.request_delay:
            time.sleep(self.request_delay - time_since_last)
            
        client = arxiv.Client(
            page_size=100,
            delay_seconds=3,
            num_retries=3
        )
        
        search = arxiv.Search(
            query=keywords,
            max_results=50,  # Reduced initial batch size
            sort_by=arxiv.SortCriterion.SubmittedDate
        )
        
        results = []
        for result in client.results(search):
            # Validate and filter before storing
            paper_data = {
                'title': result.title,
                'abstract': result.summary[:2000],  # Truncate for storage
                'authors': [a.name for a in result.authors],
                'pdf_url': result.pdf_url
            }
            if PaperSchema(**paper_data):  # Automatic validation
                results.append(paper_data)
                
        self.last_request_time = time.time()
        return results 