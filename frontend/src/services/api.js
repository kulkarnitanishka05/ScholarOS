import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Dashboard
export const getDatabaseInfo = async () => {
  const response = await api.get("/database");
  return response.data;
};

// Upload
export const uploadPDF = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data;
};

// Documents
export const getDocuments = async () => {
  const response = await api.get("/documents");
  return response.data;
};

// Chat
export const askQuestion = async (question) => {
  const response = await api.post("/ask", {
    question,
    top_k: 5,
  });

  return response.data;
};

// Summary
export const summarizeDocument = async (filename) => {
  const response = await api.post("/summary", {
    filename,
  });

  return response.data;
};

// Compare
export const compareDocuments = async (file1, file2) => {
  const response = await api.post("/compare", {
    file1,
    file2,
  });

  return response.data;
};

export default api;