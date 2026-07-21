import axios from "axios";

const API = import.meta.env.DEV
  ? "http://127.0.0.1:8000"
  : "";

const api = axios.create({
  baseURL: API,
});

// Dashboard
export const getDatabaseInfo = async () => {
  const response = await api.get("/api/database");
  return response.data;
};

// Upload
export const uploadPDF = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data;
};

// Documents
export const getDocuments = async () => {
  const response = await api.get("/api/documents");
  return response.data;
};

// Chat
export const askQuestion = async (question) => {
  const response = await api.post("/api/ask", {
    question,
    top_k: 5,
  });

  return response.data;
};

// Summary
export const summarizeDocument = async (filename) => {
  const response = await api.post("/api/summary", {
    filename,
  });

  return response.data;
};

// Compare
export const compareDocuments = async (file1, file2) => {
  const response = await api.post("/api/compare", {
    file1,
    file2,
  });

  return response.data;
};

export default api;