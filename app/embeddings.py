"""
ScholarOS - Embedding Module
----------------------------
Generates vector embeddings using Sentence Transformers.
"""

from sentence_transformers import SentenceTransformer
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()


class EmbeddingModel:
    """
    Wrapper around SentenceTransformer for generating embeddings.
    """

    def __init__(self):
        self.model_name = os.getenv(
            "EMBEDDING_MODEL",
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        print(f"[INFO] Loading embedding model: {self.model_name}")

        self.model = SentenceTransformer(self.model_name)

        print("[SUCCESS] Embedding model loaded.")

    def embed_text(self, text: str):
        """
        Generate embedding for a single text.

        Parameters
        ----------
        text : str

        Returns
        -------
        numpy.ndarray
        """

        embedding = self.model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        return embedding

    def embed_documents(self, documents):
        """
        Generate embeddings for multiple text chunks.

        Parameters
        ----------
        documents : list[str]

        Returns
        -------
        numpy.ndarray
        """

        embeddings = self.model.encode(
            documents,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=True
        )

        return embeddings

    def embedding_dimension(self):
        """
        Returns embedding vector dimension.
        """

        sample = self.embed_text("ScholarOS")

        return len(sample)

    def similarity(self, embedding1, embedding2):
        """
        Compute cosine similarity between two embeddings.
        """

        embedding1 = np.array(embedding1)
        embedding2 = np.array(embedding2)

        similarity = np.dot(embedding1, embedding2)

        return float(similarity)

    def batch_size(self):
        """
        Returns recommended batch size.
        """

        return 32


if __name__ == "__main__":

    model = EmbeddingModel()

    text = "Artificial Intelligence is transforming education."

    vector = model.embed_text(text)

    print("\nEmbedding Dimension:", model.embedding_dimension())

    print("\nFirst 10 Values:")

    print(vector[:10])

    docs = [
        "Machine Learning",
        "Natural Language Processing",
        "Computer Vision"
    ]

    vectors = model.embed_documents(docs)

    print("\nGenerated", len(vectors), "embeddings.")
    