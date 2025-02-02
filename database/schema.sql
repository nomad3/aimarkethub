CREATE TABLE papers (
    id SERIAL PRIMARY KEY,
    title TEXT,
    abstract TEXT,
    authors JSONB,
    pdf_url TEXT,
    summary TEXT,
    market_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_score ON papers(market_score);

CREATE TABLE IF NOT EXISTS processing_queue (
    task_id VARCHAR(255) PRIMARY KEY,
    paper_id INT REFERENCES papers(id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_processing_status ON processing_queue(status); 