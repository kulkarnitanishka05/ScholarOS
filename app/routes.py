"""
ScholarOS - FastAPI Routes
--------------------------
API endpoints for uploading PDFs, asking questions,
summarizing documents, comparing documents, and
managing the vector database.
"""

import os
import shutil
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from urllib.parse import unquote
from pydantic import BaseModel

from app.rag import RAGPipeline

router = APIRouter()

rag = None

def get_rag():
    global rag

    if rag is None:
        print("Loading ScholarOS RAG Pipeline...")

        rag = RAGPipeline()

    return rag

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================
# Request Models
# ==========================

class QuestionRequest(BaseModel):
    question: str
    top_k: int = 5


class SummaryRequest(BaseModel):
    filename: str


class CompareRequest(BaseModel):
    file1: str
    file2: str


# ==========================
# Upload PDF
# ==========================

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload and index a PDF.
    """

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = get_rag().index_document(file_path)

    return result


# ==========================
# List Indexed Documents
# ==========================

@router.get("/documents")
def list_documents():
    """
    List all indexed documents.
    """

    return {
        "documents": get_rag().list_documents()
    }

# ==========================
# View PDF
# ==========================

@router.get("/pdf/{filename:path}")
def view_pdf(filename: str):

    filename = unquote(filename)

    print("=" * 60)
    print("Requested filename:", repr(filename))
    print("Uploads folder:", os.path.abspath(UPLOAD_FOLDER))
    print("Files in uploads:", os.listdir(UPLOAD_FOLDER))

    pdf_path = os.path.join(UPLOAD_FOLDER, filename)

    print("Full path:", pdf_path)
    print("Exists:", os.path.exists(pdf_path))
    print("=" * 60)

    if not os.path.exists(pdf_path):
        raise HTTPException(
            status_code=404,
            detail="PDF not found."
        )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=filename
    )


# ==========================
# Ask Question
# ==========================

@router.post("/ask")
def ask_question(request: QuestionRequest):
    """
    Ask a question about indexed documents.
    """

    return get_rag().ask(
        question=request.question,
        top_k=request.top_k
    )


# ==========================
# Summarize Document
# ==========================

@router.post("/summary")
def summarize_document(request: SummaryRequest):
    """
    Summarize an uploaded document.
    """

    pdf_path = os.path.join(
        UPLOAD_FOLDER,
        request.filename
    )

    if not Path(pdf_path).exists():
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return get_rag().summarize_document(pdf_path)


# ==========================
# Compare Documents
# ==========================

@router.post("/compare")
def compare_documents(request: CompareRequest):
    """
    Compare two uploaded documents.
    """

    pdf1 = os.path.join(
        UPLOAD_FOLDER,
        request.file1
    )

    pdf2 = os.path.join(
        UPLOAD_FOLDER,
        request.file2
    )

    if not Path(pdf1).exists():
        raise HTTPException(
            status_code=404,
            detail=f"{request.file1} not found."
        )

    if not Path(pdf2).exists():
        raise HTTPException(
            status_code=404,
            detail=f"{request.file2} not found."
        )

    return get_rag().compare_documents(
        pdf1,
        pdf2
    )


# ==========================
# Database Information
# ==========================

@router.get("/database")
def database_information():
    """
    Return database statistics.
    """

    return get_rag().database_info()


# ==========================
# Clear Database
# ==========================

@router.delete("/clear")
def clear_database():
    """
    Delete all indexed vectors.
    """

    return get_rag().clear_database()
