import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Document, Page, pdfjs } from "react-pdf";

import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const API = "http://127.0.0.1:8000";

export default function PDFViewer() {
  const navigate = useNavigate();

  const { filename } = useParams();

  /* -------------------- STATE -------------------- */

  const [numPages, setNumPages] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);

  const [scale, setScale] = useState(1.2);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [fileUrl, setFileUrl] = useState("");

  /* -------------------- RESPONSIVE -------------------- */

  useEffect(() => {
    const resize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
  if (!filename) return;

  setLoading(true);

  setError("");

  setFileUrl(
    `${API}/pdf/${encodeURIComponent(filename)}`
  );
  }, [filename]);


  /* -------------------- ZOOM -------------------- */

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  /* -------------------- PAGE -------------------- */

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };
  function onLoadSuccess({ numPages }) {
   setNumPages(numPages);

   setLoading(false);
  }

  function onLoadError(err) {
    console.error("PDF Error:", err);

    setLoading(false);

    setError(err.message || "Unable to load PDF.");
  }

  useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      nextPage();
    }

    if (event.key === "ArrowLeft") {
      previousPage();
    }

    if (event.key === "+" || event.key === "=") {
      zoomIn();
    }

    if (event.key === "-") {
      zoomOut();
    }
  };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900">

        <div className="flex items-center justify-between px-8 py-4">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate(-1)}
              className="rounded-lg bg-slate-800 p-2 transition hover:bg-slate-700"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <h1 className="flex items-center gap-2 text-xl font-bold">

                <FileText
                  size={22}
                  className="text-cyan-400"
                />

                {decodeURIComponent(filename)}

              </h1>

              <p className="text-sm text-slate-400">

                ScholarOS PDF Viewer

              </p>

            </div>

          </div>

        </div>

      </header>

      {/* ================= TOOLBAR ================= */}

      <div className="sticky top-[73px] z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur">

        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-6 py-4">

          {/* Previous */}

          <button
            onClick={previousPage}
            disabled={pageNumber === 1}
            className="rounded-lg bg-slate-800 p-2 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          {/* Page */}

          <div className="rounded-lg bg-slate-800 px-4 py-2 text-sm">

            Page

            <span className="mx-2 font-bold text-cyan-400">

              {pageNumber}

            </span>

            /

            <span className="ml-2">

              {numPages || "--"}

            </span>

          </div>

          {/* Next */}

          <button
            onClick={nextPage}
            disabled={pageNumber === numPages || numPages === 0}
            className="rounded-lg bg-slate-800 p-2 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight />
          </button>

          <div className="h-8 w-px bg-slate-700" />

          {/* Zoom Out */}

          <button
            onClick={zoomOut}
            className="rounded-lg bg-slate-800 p-2 transition hover:bg-slate-700"
          >
            <ZoomOut />
          </button>

          {/* Zoom */}

          <div className="w-20 rounded-lg bg-slate-800 px-4 py-2 text-center text-sm font-semibold text-cyan-400">

            {Math.round(scale * 100)}%

          </div>

          {/* Zoom In */}

          <button
            onClick={zoomIn}
            className="rounded-lg bg-slate-800 p-2 transition hover:bg-slate-700"
          >
            <ZoomIn />
          </button>

        </div>

      </div>

      {/* ================= PDF CONTAINER ================= */}

<main className="flex justify-center p-8">

  <div
    className={`flex w-full justify-center ${
      windowWidth < 768 ? "px-2" : "px-10"
    }`}
  >

    {error ? (

      <div className="flex h-[70vh] w-full flex-col items-center justify-center">

        <AlertCircle
          size={55}
          className="text-red-500"
        />

        <h2 className="mt-4 text-xl font-semibold">
          Failed to Load PDF
        </h2>

        <p className="mt-2 text-slate-400">
          {error}
        </p>

      </div>

    ) : (

      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={
          <div className="flex h-[70vh] w-full flex-col items-center justify-center">

            <Loader2
              size={55}
              className="animate-spin text-cyan-400"
            />

            <p className="mt-5 text-slate-400">
              Loading PDF...
            </p>

          </div>
        }
      >

        <Page
          pageNumber={pageNumber}
          scale={scale}
          width={windowWidth < 768 ? windowWidth - 30 : 900}
          renderAnnotationLayer
          renderTextLayer
          className="rounded-lg bg-white shadow-2xl"
        />

      </Document>

    )}

  </div>

</main>

    </div>
  );
}