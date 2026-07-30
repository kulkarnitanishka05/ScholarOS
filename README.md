<div align="center">

# 📚 ScholarOS

### AI-Powered Document Intelligence Platform using RAG, LLMs & Semantic Search

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)

![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)

![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)

![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-orange)

![RAG](https://img.shields.io/badge/RAG-Enabled-red)

![License](https://img.shields.io/badge/License-MIT-yellow)


An AI-powered document analysis platform that enables users to upload PDF documents, ask questions, generate summaries, compare documents, and retrieve relevant information using Retrieval-Augmented Generation (RAG).

</div>

---

# 🚀 Features

- 📄 Upload and index PDF documents
- 🤖 AI-powered Question Answering using RAG
- 🔍 Semantic Search using Sentence Transformers
- 🧠 Vector Search with FAISS
- 📝 Automatic Document Summarization
- 📊 Compare Two PDF Documents
- 📚 Multi-document Retrieval
- 📑 Source Citations with Page Numbers
- ⚡ FastAPI Backend
- 🎨 Modern React Frontend

---

# ✨ Highlights

- 🔍 Retrieval-Augmented Generation (RAG)
- 🧠 Semantic Search with FAISS
- 🤖 Llama 3.3 (Groq API)
- 📄 Multi-PDF Analysis
- 📝 AI Summarization
- 📊 Document Comparison
- ⚡ FastAPI + React Architecture

---

# 🏗️ System Architecture

```
                User
                  │
                  ▼
         React Frontend
                  │
                  ▼
            FastAPI API
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
 PDF Parser              Groq LLM
(PyMuPDF)              (Llama 3.3)
      │
      ▼
Text Chunking
      │
      ▼
Sentence Transformers
      │
      ▼
FAISS Vector Database
      │
      ▼
Relevant Context
      │
      ▼
Generated Answer
```
---
# 📸 Application Screenshots

## 🏠 Home

![Home](home-1.png)

##   Login Page

![Login](login.png)

## 📊 Dashboard

![Dashboard](dashboard.png)

## 📄 Upload PDF

![Upload](upload.png)

## 🤖 AI Chat

![Ai-Chat](ai-chat.png)

## 💬 AI Answer

![Answer](answer.png)

## 📝 Summary

![Summary](summary.png)

## 📊 Compare Documents

![Compare](compare.png)

## 📑 PDF Viewer

![PDF-Viewer](pdf-viewer.png)


# 🛠 Tech Stack

## Frontend

- React
- Vite
- JavaScript
- CSS

---

## Backend

- FastAPI
- Python

---

## AI / NLP

- Retrieval-Augmented Generation (RAG)
- Sentence Transformers
- FAISS
- Groq API
- Llama 3.3 70B

---

## PDF Processing

- PyMuPDF
- PDFPlumber
- LangChain Text Splitter

---

## Machine Learning

- NumPy
- PyTorch
- Transformers

---

# 📂 Project Structure

```
ScholarOS
│
├── app
│   ├── embeddings.py
│   ├── llm.py
│   ├── main.py
│   ├── parser.py
│   ├── rag.py
│   ├── routes.py
│   └── vector_store.py
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── uploads
├── vector_db
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone git clone https://github.com/kulkarnitanishka05/ScholarOS.git

cd ScholarOS
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Install Frontend

```bash
cd frontend

npm install
```

---


# 🔑 Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
VECTOR_DB_PATH=vector_db
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

---

# ▶ Running the Project

Backend

```bash
uvicorn app.main:app --reload
```

Frontend

```bash
cd frontend

npm run dev
```

---

# 📖 How It Works

1. Upload a PDF.
2. PDF is parsed into text.
3. Text is divided into chunks.
4. Sentence Transformer converts chunks into embeddings.
5. Embeddings are stored inside FAISS.
6. User asks a question.
7. Relevant chunks are retrieved.
8. Context is sent to Llama 3.3 via Groq.
9. AI generates an answer with citations.

---

# 💡 Example Use Cases

- Research Paper Analysis
- Academic Learning
- Study Notes Generation
- Technical Documentation Search
- Company Policy Analysis
- Legal Document Review
- Resume Screening
- Knowledge Management

---

# 🔮 Future Improvements

- User Authentication
- Chat History
- OCR for Scanned PDFs
- Multi-language Support
- Image Understanding
- Voice-based Queries
- Cloud Deployment
- Docker Support
- Document Highlighting
- Citation Export

---

# 📈 Skills Demonstrated

- Retrieval-Augmented Generation (RAG)
- NLP
- Semantic Search
- Vector Databases
- LLM Integration
- REST API Development
- React Development
- FastAPI
- AI System Design

---

# 👩‍💻 Author

**Tanishka Kulkarni**

Artificial Intelligence & Machine Learning Student

GitHub:
https://github.com/kulkarnitanishka05

LinkedIn:
www.linkedin.com/in/tanishka-kulkarni-b3b457380

---

# 📄 License

This project is licensed under the MIT License.

---
# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
