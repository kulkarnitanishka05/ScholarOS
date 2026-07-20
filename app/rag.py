"""
ScholarOS - RAG Pipeline
------------------------
Retrieval Augmented Generation Pipeline
"""

import os
from pathlib import Path

from app.parser import PDFParser
from app.vector_store import VectorStore
from app.llm import LLM


class RAGPipeline:

    def __init__(self):

        self.parser = PDFParser()

        self.vector_store = VectorStore()

        self.llm = LLM()

        # Load existing vector database if available
        self.vector_store.load()

    def index_document(self, pdf_path):
        """
        Parse a PDF and store its chunks in the vector database.

        Parameters
        ----------
        pdf_path : str
            Path of uploaded PDF.

        Returns
        -------
        dict
        """

        if not Path(pdf_path).exists():
            raise FileNotFoundError(
                f"{pdf_path} not found."
            )

        print(f"\nIndexing : {pdf_path}")

        parsed_document = self.parser.parse(pdf_path)

        chunks = parsed_document["chunks"]

        source_file = Path(pdf_path).name

        self.vector_store.add_documents(
            chunks,
            source_file
        )

        self.vector_store.save()

        return {

            "status": "success",

            "file": source_file,

            "pages": len(parsed_document["pages"]),

            "chunks": len(chunks)

        }

    def index_directory(self, folder_path):
        """
        Index all PDFs inside a folder.
        """

        folder = Path(folder_path)

        if not folder.exists():
            raise FileNotFoundError(folder)

        indexed_files = []

        for pdf in folder.glob("*.pdf"):

            try:

                result = self.index_document(
                    str(pdf)
                )

                indexed_files.append(result)

            except Exception as e:

                print(f"Error : {pdf.name}")

                print(e)

        return indexed_files

    def list_documents(self):
        """
        Return all indexed documents.
        """

        return self.vector_store.list_documents()
    def retrieve(self, question, top_k=5):
        """
        Retrieve the most relevant chunks from FAISS.

        Parameters
        ----------
        question : str
            User question.

        top_k : int
            Number of chunks to retrieve.

        Returns
        -------
        list
        """

        results = self.vector_store.search(
            question,
            top_k
        )

        return results

    def build_context(self, retrieved_chunks):
        """
        Build a single context string from retrieved chunks.
        """

        context = ""

        for chunk in retrieved_chunks:

            context += chunk["text"]

            context += "\n\n"

        return context.strip()

    def build_citations(self, retrieved_chunks):
        """
        Prepare citation information.
        """

        citations = []

        seen = set()

        for chunk in retrieved_chunks:

            key = (
                chunk["source"],
                chunk["page"]
            )

            if key in seen:
                continue

            seen.add(key)

            citations.append(
                {
                    "source": chunk["source"],
                    "page": chunk["page"],
                    "score": round(
                        chunk["score"],
                        4
                    )
                }
            )

        return citations

    def ask(self, question, top_k=5):
        """
        Complete RAG pipeline.

        PDF
            ↓
        FAISS Retrieval
            ↓
        Context Building
            ↓
        LLM
            ↓
        Answer + Citations
        """

        if self.vector_store.is_empty():

            return {

                "status": "error",

                "message": "No documents have been indexed."

            }

        retrieved_chunks = self.retrieve(
            question,
            top_k
        )

        if len(retrieved_chunks) == 0:

            return {

                "status": "error",

                "message": "No relevant context found."

            }

        context = self.build_context(
            retrieved_chunks
        )

        answer = self.llm.generate_answer(
            context=context,
            question=question
        )

        citations = self.build_citations(
            retrieved_chunks
        )

        return {

            "status": "success",

            "question": question,

            "answer": answer,

            "citations": citations,

            "retrieved_chunks": len(
                retrieved_chunks
            )
        }
    def summarize_document(self, pdf_path):
        """
        Summarize a PDF document.
        """

        parsed_document = self.parser.parse(pdf_path)

        summary = self.llm.summarize(
            parsed_document["text"]
        )

        return {
            "status": "success",
            "file": Path(pdf_path).name,
            "summary": summary
        }

    def compare_documents(self, pdf1, pdf2):
        """
        Compare two PDF documents.
        """

        document1 = self.parser.parse(pdf1)

        document2 = self.parser.parse(pdf2)

        comparison = self.llm.compare_documents(
            document1["text"],
            document2["text"]
        )

        return {
            "status": "success",
            "document1": Path(pdf1).name,
            "document2": Path(pdf2).name,
            "comparison": comparison
        }

    def clear_database(self):
        """
        Clear the vector database.
        """

        self.vector_store.clear()

        self.vector_store.save()

        return {
            "status": "success",
            "message": "Vector database cleared."
        }

    def database_info(self):
        """
        Return database statistics.
        """

        documents = self.vector_store.list_documents()

        return {
            "total_documents": len(documents),
            "documents": documents,
            "total_chunks": self.vector_store.total_documents(),
            "total_vectors": self.vector_store.total_vectors(),
            "model": "Llama 3.3 70B"
        }
    
if __name__ == "__main__":

    rag = RAGPipeline()

    pdf = "sample.pdf"

    try:

        print("=" * 60)
        print("ScholarOS RAG Demo")
        print("=" * 60)

        print("\nIndexing document...\n")

        info = rag.index_document(pdf)

        print(info)

        print("\nDatabase Info\n")

        print(rag.database_info())

        print("\nQuestion Answering\n")

        question = "What is Artificial Intelligence?"

        result = rag.ask(
            question,
            top_k=5
        )

        print("\nQuestion:\n")

        print(result["question"])

        print("\nAnswer:\n")

        print(result["answer"])

        print("\nSources:\n")

        for citation in result["citations"]:

            print(
                f"{citation['source']} "
                f"(Page {citation['page']}) "
                f"Score: {citation['score']}"
            )

        print("\nDocument Summary\n")

        summary = rag.summarize_document(pdf)

        print(summary["summary"])

    except Exception as e:

        print("\nERROR")

        print(e)

