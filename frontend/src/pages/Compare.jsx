import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getDocuments,
  compareDocuments,
} from "../services/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Compare() {

  const [documents, setDocuments] = useState([]);

  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");

  const [comparison, setComparison] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();

      setDocuments(data.documents);

      if (data.documents.length >= 2) {
        setFile1(data.documents[0]);
        setFile2(data.documents[1]);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const compare = async () => {

    if (!file1 || !file2) {
      alert("Please select both documents.");
      return;
    }

    if (file1 === file2) {
      alert("Please choose two different documents.");
      return;
    }

    try {

      setLoading(true);

      const result = await compareDocuments(
        file1,
        file2
      );

      if (result.status === "success") {
        setComparison(result.comparison);
      } else {
        setComparison(result.message);
      }

    } catch (err) {

      console.error(err);

      setComparison("Comparison failed.");

    }

    setLoading(false);
  };

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Compare Documents
      </h1>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

        <label className="text-white font-medium">
          Document 1
        </label>

        <select
          value={file1}
          onChange={(e) => setFile1(e.target.value)}
          className="w-full mt-3 mb-6 bg-slate-800 text-white rounded-lg p-3 border border-slate-700"
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

        <label className="text-white font-medium">
          Document 2
        </label>

        <select
          value={file2}
          onChange={(e) => setFile2(e.target.value)}
          className="w-full mt-3 bg-slate-800 text-white rounded-lg p-3 border border-slate-700"
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
          onClick={compare}
          className="mt-8 bg-cyan-500 hover:bg-cyan-600 transition px-8 py-3 rounded-xl text-white font-bold"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>

      </div>

      {comparison && (

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mt-8">

          <h2 className="text-3xl font-bold text-cyan-400 mb-8">
            📊 AI Comparison Report
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
            "
          >

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {comparison}
            </ReactMarkdown>

          </div>

        </div>

      )}

    </MainLayout>
  );
}