const API = "http://127.0.0.1:8000";

export async function getDocuments() {
  const response = await fetch(`${API}/documents`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}