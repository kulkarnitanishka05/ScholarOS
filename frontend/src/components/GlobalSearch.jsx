import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Search,
  FileText,
  MessageSquare,
  Clock,
  X,
} from "lucide-react";

import { getConversations } from "../services/chatHistory";
import { getDocuments } from "../services/searchService";
export default function GlobalSearch() {

  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);

  const [results, setResults] = useState([]);

  const [documents, setDocuments] = useState([]);

  const [recentSearches, setRecentSearches] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);

  const inputRef = useRef(null);

  const navigate = useNavigate();
    // Load documents and recent searches

  useEffect(() => {

    getDocuments()
      
      .then((data) => {
        setDocuments(data.documents || []);
      })
      .catch(() => setDocuments([]));

    const recent = JSON.parse(
      localStorage.getItem("recent_searches") || "[]"
    );

    setRecentSearches(recent);

  }, []);

  // Search documents + chats

  useEffect(() => {

    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    const documentResults = documents
        .filter((doc) =>
          doc.toLowerCase().includes(q)
        )
        .map((doc) => ({
          type: "document",
          title: doc,
          subtitle: "Uploaded Document",
        }));

    const chatResults = getConversations()
      .filter((chat) =>
        chat.title.toLowerCase().includes(q)
      )
      .map((chat) => ({
        type: "chat",
        title: chat.title,
        subtitle: "Previous Conversation",
      }));

    setResults([
      ...documentResults,
      ...chatResults,
    ]);

    setSelectedIndex(-1);

  }, [query, documents]);
    // Keyboard Navigation

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
      }

      if (e.key === "Escape") {
        setOpen(false);
      }

      if (e.key === "Enter") {
        if (selectedIndex >= 0) {
          selectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [open, results, selectedIndex]);


  // Click Outside

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);
    const saveRecentSearch = (text) => {

    if (!text.trim()) return;

    let history = JSON.parse(
      localStorage.getItem("recent_searches") || "[]"
    );

    history = history.filter(
      (item) => item !== text
    );

    history.unshift(text);

    history = history.slice(0, 6);

    localStorage.setItem(
      "recent_searches",
      JSON.stringify(history)
    );

    setRecentSearches(history);

  };


    const selectResult = (item) => {

      saveRecentSearch(item.title);

      setQuery(item.title);

      setOpen(false);

      if (item.type === "document") {
        navigate(`/viewer/${encodeURIComponent(item.title)}`);
        return;
      }

      if (item.type === "chat") {
        navigate("/chat");
       }
    };


  const removeRecentSearch = (text) => {

    const updated = recentSearches.filter(
      (item) => item !== text
    );

    localStorage.setItem(
      "recent_searches",
      JSON.stringify(updated)
    );

    setRecentSearches(updated);

  };
    return (

    <div
      ref={searchRef}
      className="relative w-[420px]"
    >

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
      />

      <input
        ref={inputRef}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        placeholder="Search documents & chats..."
        className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
      />

      <AnimatePresence>

        {open && (

          <motion.div

            initial={{
              opacity: 0,
              y: 8,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: 8,
            }}

            className="absolute mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"

          >

            {!query && recentSearches.length > 0 && (

              <>

                <div className="border-b border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400">

                  Recent Searches

                </div>

                {recentSearches.map((item) => (

                  <button

                    key={item}

                    onClick={() => {
                      setQuery(item);
                    }}

                    className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-800"

                  >

                    <div className="flex items-center gap-3">

                      <Clock
                        size={16}
                        className="text-slate-500"
                      />

                      <span className="text-white">

                        {item}

                      </span>

                    </div>

                    <X
                      size={16}
                      onClick={(e) => {

                        e.stopPropagation();

                        removeRecentSearch(item);

                      }}
                      className="text-slate-500 hover:text-red-400"
                    />

                  </button>

                ))}

              </>

            )}

            {query && results.length > 0 && (

              results.map((item, index) => (

                <button

                  key={index}

                  onClick={() => selectResult(item)}

                  className={`flex w-full items-center gap-4 px-4 py-3 transition ${
                    selectedIndex === index
                      ? "bg-cyan-500/15"
                      : "hover:bg-slate-800"
                  }`}

                >

                  {item.type === "document" ? (

                    <FileText
                      size={18}
                      className="text-cyan-400"
                    />

                  ) : (

                    <MessageSquare
                      size={18}
                      className="text-violet-400"
                    />

                  )}

                  <div className="text-left">

                    <p className="font-medium text-white">

                      {item.title}

                    </p>

                    <p className="text-xs text-slate-400">

                      {item.subtitle}

                    </p>

                  </div>

                </button>

              ))

            )}

            {query && results.length === 0 && (

              <div className="px-6 py-10 text-center">

                <Search
                  size={34}
                  className="mx-auto mb-3 text-slate-600"
                />

                <p className="font-medium text-white">

                  No Results Found

                </p>

                <p className="mt-2 text-sm text-slate-500">

                  Try searching another document or chat.

                </p>

              </div>

            )}

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  );

}