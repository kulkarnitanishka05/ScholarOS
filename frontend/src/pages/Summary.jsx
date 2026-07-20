import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getDocuments,
  summarizeDocument,
} from "../services/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Summary() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();

      setDocuments(data.documents);

      if (data.documents.length > 0) {
        setSelectedDocument(data.documents[0]);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const generateSummary = async () => {

    if (!selectedDocument) {
      alert("Please select a document.");
      return;
    }

    try {

      setLoading(true);

      const result = await summarizeDocument(
        selectedDocument
      );

      if (result.status === "success") {
        setSummary(result.summary);
      } else {
        setSummary(result.message);
      }

    } catch (error) {

      console.error(error);

      setSummary("Failed to generate summary.");

    }

    setLoading(false);
  };

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        📝 AI Document Summary
      </h1>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

        <label className="text-white font-medium">
          Select Document
        </label>

        <select
          value={selectedDocument}
          onChange={(e) =>
            setSelectedDocument(e.target.value)
          }
          className="w-full mt-4 bg-slate-800 border border-slate-700 text-white p-3 rounded-lg"
        >

          {documents.map((doc, index) => (

            <option
              key={index}
              value={doc}
            >
              {doc}
            </option>

          ))}

        </select>

        <button
          onClick={generateSummary}
          className="mt-8 bg-cyan-500 hover:bg-cyan-600 transition px-8 py-3 rounded-xl text-white font-bold"
        >
          {loading
            ? "Generating..."
            : "Generate Summary"}
        </button>

      </div>

      {summary && (

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mt-8">

          <h2 className="text-3xl font-bold text-cyan-400 mb-8">
            📄 AI Summary Report
          </h2>

          <div
            className="
              prose
              prose-invert
              max-w-none

              prose-headings:text-cyan-400
              prose-headings:font-bold

              prose-h1:text-4xl
              prose-h2:text-3xl
              prose-h3:text-2xl

              prose-p:text-gray-300
              prose-p:leading-8

              prose-ul:my-4
              prose-li:text-gray-300
              prose-li:marker:text-cyan-400

              prose-strong:text-white
              prose-code:text-cyan-300

              prose-blockquote:border-cyan-500
              prose-blockquote:text-gray-300
            "
          >

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {summary}
            </ReactMarkdown>

          </div>

        </div>

      )}

    </MainLayout>
  );
}
