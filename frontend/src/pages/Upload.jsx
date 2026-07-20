import { useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { uploadPDF } from "../services/api";

export default function Upload() {
  const inputRef = useRef();

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const selectFile = (selected) => {
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    setFile(selected);
    setMessage("");
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const upload = async () => {
    if (!file) {
      alert("Please select a PDF.");
      return;
    }

    try {
      setUploading(true);

      await uploadPDF(file, (event) => {
        if (event.total) {
          setProgress(
            Math.round((event.loaded * 100) / event.total)
          );
        }
      });

      setMessage("✅ Upload Successful");

      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setMessage("❌ Upload Failed");
    }
  };

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Upload Research Paper
      </h1>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className="bg-slate-900 rounded-2xl border-2 border-dashed border-cyan-500 p-16 text-center cursor-pointer hover:bg-slate-800 transition"
      >

        <h1 className="text-6xl">📄</h1>

        <h2 className="text-2xl text-white mt-5">
          Drag & Drop your PDF
        </h2>

        <p className="text-gray-400 mt-3">
          or click to browse
        </p>

      </div>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => selectFile(e.target.files[0])}
      />

      {file && (
        <div className="mt-8 bg-slate-900 rounded-xl p-5">

          <h3 className="text-white font-semibold">
            Selected File
          </h3>

          <p className="text-cyan-400 mt-2">
            {file.name}
          </p>

        </div>
      )}

      {uploading && (
        <div className="mt-8">

          <div className="bg-slate-700 h-4 rounded-full">

            <div
              className="bg-cyan-500 h-4 rounded-full"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="text-white mt-2">
            {progress}%
          </p>

        </div>
      )}

      <button
        onClick={upload}
        className="mt-8 px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
      >
        Upload PDF
      </button>

      {message && (
        <p className="mt-8 text-xl text-green-400">
          {message}
        </p>
      )}

    </MainLayout>
  );
}