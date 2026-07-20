"""
ScholarOS - Vector Store
------------------------
Stores document chunks in a FAISS vector database.
"""

import os
import pickle
from pathlib import Path

import faiss
import numpy as np
from dotenv import load_dotenv

from app.embeddings import EmbeddingModel

load_dotenv()


class VectorStore:
    """
    Handles storage and retrieval of document embeddings
    using FAISS.
    """

    def __init__(self):

        # Load embedding model
        self.embedding_model = EmbeddingModel()

        # Embedding dimension
        self.dimension = self.embedding_model.embedding_dimension()

        # FAISS cosine similarity index
        self.index = faiss.IndexFlatIP(self.dimension)

        # Stores metadata for every chunk
        self.documents = []

        # Database location
        self.db_path = Path(
            os.getenv("VECTOR_DB_PATH", "vector_db")
        )

        self.db_path.mkdir(
            exist_ok=True
        )

        self.index_file = self.db_path / "faiss.index"

        self.metadata_file = self.db_path / "documents.pkl"

    def add_documents(
        self,
        chunks,
        source_file
    ):
        """
        Add document chunks to FAISS.

        Parameters
        ----------
        chunks : list

            [
                {
                    "text": "...",
                    "page": 1
                }
            ]

        source_file : str
            PDF filename.
        """

        if len(chunks) == 0:
            return

        embeddings = []

        for chunk in chunks:

            text = chunk["text"]

            embedding = self.embedding_model.embed_text(
                text
            )

            embeddings.append(embedding)

            self.documents.append(
                {
                    "text": text,
                    "page": chunk["page"],
                    "source": source_file
                }
            )

        embeddings = np.array(
            embeddings,
            dtype=np.float32
        )

        self.index.add(embeddings)

        print(
            f"[SUCCESS] Added {len(chunks)} chunks from '{source_file}'."
        )

    def save(self):
        """
        Save FAISS index and metadata.
        """

        faiss.write_index(
            self.index,
            str(self.index_file)
        )

        with open(
            self.metadata_file,
            "wb"
        ) as file:

            pickle.dump(
                self.documents,
                file
            )

        print(
            "[SUCCESS] Vector database saved."
        )

    def load(self):
        """
        Load vector database if available.
        """

        if self.index_file.exists():

            self.index = faiss.read_index(
                str(self.index_file)
            )

        if self.metadata_file.exists():

            with open(
                self.metadata_file,
                "rb"
            ) as file:

                self.documents = pickle.load(file)

        print(
            f"[SUCCESS] Loaded {len(self.documents)} chunks."
        )
    def search(self, query, top_k=5):
        """
        Search the most relevant chunks for a query.

        Parameters
        ----------
        query : str
            User question.

        top_k : int
            Number of results to return.

        Returns
        -------
        list
            Retrieved document chunks.
        """

        if self.index.ntotal == 0:
            return []

        query_embedding = self.embedding_model.embed_text(
            query
        )

        query_embedding = np.array(
            [query_embedding],
            dtype=np.float32
        )

        scores, indices = self.index.search(
            query_embedding,
            top_k
        )

        results = []

        for score, idx in zip(scores[0], indices[0]):

            if idx == -1:
                continue

            document = self.documents[idx].copy()

            document["score"] = float(score)

            results.append(document)

        return results


    def clear(self):
        """
        Remove every vector from the database.
        """

        self.index = faiss.IndexFlatIP(
            self.dimension
        )

        self.documents = []

        print(
            "[SUCCESS] Vector database cleared."
        )


    def delete_document(self, source_file):
        """
        Delete all chunks belonging to one document.

        Parameters
        ----------
        source_file : str
            PDF filename.
        """

        remaining = [

            doc

            for doc in self.documents

            if doc["source"] != source_file

        ]

        # Reset database
        self.index = faiss.IndexFlatIP(
            self.dimension
        )

        self.documents = []

        if len(remaining) == 0:

            print(
                "[SUCCESS] Document removed. Database is empty."
            )

            return

        # Group chunks by source file
        grouped_documents = {}

        for doc in remaining:

            grouped_documents.setdefault(
                doc["source"],
                []
            ).append(
                {
                    "text": doc["text"],
                    "page": doc["page"]
                }
            )

        # Rebuild the FAISS index
        for source, chunks in grouped_documents.items():

            self.add_documents(
                chunks,
                source
            )

        print(
            f"[SUCCESS] Deleted '{source_file}'."
        )
    def total_documents(self):
        """
        Return the total number of stored chunks.
        """

        return len(self.documents)


    def total_vectors(self):
        """
        Return the total number of vectors in FAISS.
        """

        return self.index.ntotal


    def list_documents(self):
        """
        Return a sorted list of unique document names.
        """

        return sorted(
            list(
                {
                    document["source"]
                    for document in self.documents
                }
            )
        )


    def is_empty(self):
        """
        Check whether the vector database is empty.
        """

        return self.index.ntotal == 0
    
if __name__ == "__main__":

    store = VectorStore()

    sample_chunks = [

        {
            "text": "Artificial Intelligence enables machines to perform intelligent tasks.",
            "page": 1
        },

        {
            "text": "Machine Learning is a subset of Artificial Intelligence.",
            "page": 2
        },

        {
            "text": "Deep Learning uses neural networks with many layers.",
            "page": 3
        }

    ]

    print("=" * 60)
    print("ScholarOS Vector Store Demo")
    print("=" * 60)

    store.add_documents(
        sample_chunks,
        "sample.pdf"
    )

    store.save()

    store.load()

    print("\nTotal Chunks :")

    print(store.total_documents())

    print("\nTotal Vectors :")

    print(store.total_vectors())

    print("\nDocuments :")

    print(store.list_documents())

    print("\nSearch Results\n")

    results = store.search(
        "What is Machine Learning?",
        top_k=2
    )

    for result in results:

        print("-" * 60)

        print("Source :", result["source"])

        print("Page   :", result["page"])

        print("Score  :", result["score"])

        print("Text   :")

        print(result["text"])
