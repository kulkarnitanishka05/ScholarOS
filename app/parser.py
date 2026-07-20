"""
ScholarOS - PDF Parser
----------------------
Extract text from PDF and create page-aware chunks for RAG.
"""

import os
import fitz
from pathlib import Path
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.utils import clean_text, is_pdf

load_dotenv()


class PDFParser:

    def __init__(self):

        self.chunk_size = int(
            os.getenv("CHUNK_SIZE", 1000)
        )

        self.chunk_overlap = int(
            os.getenv("CHUNK_OVERLAP", 200)
        )

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def extract_pages(self, pdf_path):
        """
        Extract text page by page.
        """

        if not Path(pdf_path).exists():
            raise FileNotFoundError(pdf_path)

        if not is_pdf(pdf_path):
            raise ValueError("Only PDF files are supported.")

        document = fitz.open(pdf_path)

        pages = []

        try:

            for page_number, page in enumerate(document):

                text = clean_text(
                    page.get_text("text")
                )

                pages.append(
                    {
                        "page": page_number + 1,
                        "text": text
                    }
                )

        finally:

            document.close()

        return pages

    def extract_text(self, pdf_path):
        """
        Extract complete PDF text.
        """

        pages = self.extract_pages(pdf_path)

        return "\n".join(
            page["text"]
            for page in pages
        )

    def create_chunks(self, pages):
        """
        Create page-aware chunks.

        Returns
        -------
        [
            {
                "text": "...",
                "page": 1
            },
            ...
        ]
        """

        chunks = []

        for page in pages:

            split_chunks = self.splitter.split_text(
                page["text"]
            )

            for chunk in split_chunks:

                chunks.append(
                    {
                        "text": chunk,
                        "page": page["page"]
                    }
                )

        return chunks

    def parse(self, pdf_path):
        """
        Complete parsing pipeline.
        """

        pages = self.extract_pages(pdf_path)

        text = self.extract_text(pdf_path)

        chunks = self.create_chunks(pages)

        return {

            "text": text,

            "pages": pages,

            "chunks": chunks

        }

    def metadata(self, pdf_path):

        document = fitz.open(pdf_path)

        meta = document.metadata

        document.close()

        return meta

    def page_count(self, pdf_path):

        document = fitz.open(pdf_path)

        count = len(document)

        document.close()

        return count


if __name__ == "__main__":

    parser = PDFParser()

    pdf = "sample.pdf"

    result = parser.parse(pdf)

    print("=" * 60)

    print("Pages :", parser.page_count(pdf))

    print("Chunks:", len(result["chunks"]))

    print("=" * 60)

    print("\nFirst Chunk:\n")

    print(result["chunks"][0])
    