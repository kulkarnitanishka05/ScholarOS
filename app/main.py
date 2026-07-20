"""
ScholarOS - Main FastAPI Application
------------------------------------
Entry point for the ScholarOS backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router

app = FastAPI(
    title="ScholarOS",
    description="AI-powered Research Assistant using RAG",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("🚀 ScholarOS Backend Started Successfully")
    print("=" * 50)


@app.on_event("shutdown")
async def shutdown_event():
    print("=" * 50)
    print("🛑 ScholarOS Backend Stopped")
    print("=" * 50)


@app.get("/")
async def root():
    return {
        "message": "Welcome to ScholarOS API 🚀",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ScholarOS Backend"
    }
