"""
ScholarOS - Main FastAPI Application
------------------------------------
Entry point for the ScholarOS backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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
app.include_router(router, prefix="/api")
BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

if FRONTEND_DIST.exists():

    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):

        file_path = FRONTEND_DIST / full_path

        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)

        return FileResponse(FRONTEND_DIST / "index.html")


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





@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ScholarOS Backend"
    }
