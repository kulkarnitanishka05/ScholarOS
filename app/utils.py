"""
ScholarOS - Utility Functions
-----------------------------
Common helper functions used throughout the project.
"""

import os
import re
import hashlib
from pathlib import Path

# ---------------------------------------------------
# Allowed File Types
# ---------------------------------------------------

ALLOWED_EXTENSIONS = {".pdf"}

# ---------------------------------------------------
# Check PDF File
# ---------------------------------------------------

def is_pdf(filename: str) -> bool:
    """
    Check whether uploaded file is a PDF.
    """

    extension = Path(filename).suffix.lower()
    return extension in ALLOWED_EXTENSIONS


# ---------------------------------------------------
# Clean Extracted Text
# ---------------------------------------------------

def clean_text(text: str) -> str:
    """
    Clean extracted PDF text.

    Removes:
    - Extra spaces
    - Multiple newlines
    - Tabs
    - Non-printable characters
    """

    if not text:
        return ""

    text = text.replace("\t", " ")

    text = re.sub(r"\n+", "\n", text)

    text = re.sub(r" +", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ---------------------------------------------------
# Remove Empty Lines
# ---------------------------------------------------

def remove_empty_lines(text: str) -> str:

    lines = text.splitlines()

    lines = [line.strip() for line in lines if line.strip()]

    return "\n".join(lines)


# ---------------------------------------------------
# Generate SHA256 Hash
# ---------------------------------------------------

def generate_file_hash(filepath: str) -> str:
    """
    Generate SHA256 hash.

    Useful to avoid duplicate uploads.
    """

    sha = hashlib.sha256()

    with open(filepath, "rb") as file:

        while True:

            chunk = file.read(4096)

            if not chunk:
                break

            sha.update(chunk)

    return sha.hexdigest()


# ---------------------------------------------------
# File Size
# ---------------------------------------------------

def file_size_mb(filepath: str) -> float:

    size = os.path.getsize(filepath)

    return round(size / (1024 * 1024), 2)


# ---------------------------------------------------
# Create Directory
# ---------------------------------------------------

def create_directory(path: str):

    os.makedirs(path, exist_ok=True)


# ---------------------------------------------------
# Chunk Statistics
# ---------------------------------------------------

def chunk_statistics(chunks):

    lengths = [len(chunk) for chunk in chunks]

    if len(lengths) == 0:

        return {
            "total_chunks": 0,
            "average_length": 0,
            "minimum_length": 0,
            "maximum_length": 0
        }

    return {

        "total_chunks": len(chunks),

        "average_length": round(sum(lengths) / len(lengths), 2),

        "minimum_length": min(lengths),

        "maximum_length": max(lengths)
    }


# ---------------------------------------------------
# Normalize Question
# ---------------------------------------------------

def normalize_question(question: str) -> str:

    question = question.lower()

    question = re.sub(r"\s+", " ", question)

    return question.strip()


# ---------------------------------------------------
# Remove Duplicate Spaces
# ---------------------------------------------------

def normalize_whitespace(text: str):

    return re.sub(r"\s+", " ", text).strip()


# ---------------------------------------------------
# Word Count
# ---------------------------------------------------

def word_count(text: str):

    return len(text.split())


# ---------------------------------------------------
# Character Count
# ---------------------------------------------------

def character_count(text: str):

    return len(text)


# ---------------------------------------------------
# Preview Text
# ---------------------------------------------------

def preview(text: str, length: int = 250):

    if len(text) <= length:

        return text

    return text[:length] + "..."


# ---------------------------------------------------
# Success Message
# ---------------------------------------------------

def success(message: str):

    print(f"[SUCCESS] {message}")


# ---------------------------------------------------
# Error Message
# ---------------------------------------------------

def error(message: str):

    print(f"[ERROR] {message}")


# ---------------------------------------------------
# Info Message
# ---------------------------------------------------

def info(message: str):

    print(f"[INFO] {message}")