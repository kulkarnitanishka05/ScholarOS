import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import MainLayout from "../layouts/MainLayout";
import { askQuestion } from "../services/api";

import {
  createConversation,
  getConversation,
  getSortedConversations,
  updateConversation,
} from "../services/chatHistory";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);

  const [currentChatId, setCurrentChatId] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadHistory = () => {
    setChatHistory(getSortedConversations());
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setQuestion("");
  };

  const handleLoadConversation = (id) => {
    const conversation = getConversation(id);

    if (!conversation) return;

    setCurrentChatId(id);
    setMessages(conversation.messages);
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    let updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    let activeChatId = currentChatId;

    if (!activeChatId) {
      const conversation = createConversation(question);

      activeChatId = conversation.id;

      setCurrentChatId(activeChatId);

      updateConversation(
        activeChatId,
        updatedMessages
      );

      loadHistory();
    } else {
      updateConversation(
        activeChatId,
        updatedMessages
      );
    }

    const currentQuestion = question;

    setQuestion("");

    try {
      setLoading(true);

      const result = await askQuestion(
        currentQuestion
      );

      let aiText = "";

      if (result.status === "success") {
        aiText = result.answer;
      } else {
        aiText =
          result.message ||
          "No answer found.";
      }

      const aiMessage = {
        role: "assistant",
        content: aiText,
        citations:
          result.citations || [],
      };

      updatedMessages = [
        ...updatedMessages,
        aiMessage,
      ];

      setMessages(updatedMessages);

      updateConversation(
        activeChatId,
        updatedMessages
      );

      loadHistory();
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: "assistant",
        content:
          "Something went wrong while contacting the AI.",
      };

      updatedMessages = [
        ...updatedMessages,
        errorMessage,
      ];

      setMessages(updatedMessages);

      updateConversation(
        activeChatId,
        updatedMessages
      );

      loadHistory();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-12 gap-6 h-[85vh]">

        {/* ================= Sidebar ================= */}

        <div className="col-span-3 bg-slate-900 rounded-2xl p-5 flex flex-col">

          <button
            onClick={handleNewChat}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition"
          >
            + New Chat
          </button>

          <h2 className="text-white text-lg font-bold mt-6 mb-3">
            Recent Chats
          </h2>

          <div className="overflow-y-auto space-y-2 flex-1">

            {chatHistory.length === 0 && (
              <p className="text-gray-500 text-sm">
                No conversations yet.
              </p>
            )}

            {chatHistory.map((chat) => (

              <button
                key={chat.id}
                onClick={() =>
                  handleLoadConversation(chat.id)
                }
                className={`w-full text-left rounded-xl p-3 transition border ${
                  currentChatId === chat.id
                    ? "bg-cyan-600 border-cyan-500"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700"
                }`}
              >
                <p className="text-white font-medium truncate">
                  {chat.title}
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  {new Date(
                    chat.updatedAt
                  ).toLocaleString()}
                </p>

              </button>

            ))}

          </div>

        </div>

        {/* ================= Chat Area ================= */}

        <div className="col-span-9 bg-slate-900 rounded-2xl flex flex-col">

          {/* Header */}

          <div className="border-b border-slate-700 p-5">

            <h1 className="text-3xl font-bold text-white">
              ScholarOS AI Chat
            </h1>

            <p className="text-gray-400 mt-1">
              Ask questions about your uploaded documents.
            </p>

          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {messages.length === 0 && (

              <div className="text-center mt-20">

                <h2 className="text-3xl font-bold text-white">
                  Welcome to ScholarOS
                </h2>

                <p className="text-gray-400 mt-3">
                  Start asking questions about your PDFs.
                </p>

              </div>

            )}

            {messages.map((message, index) => (

              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-3xl rounded-2xl px-5 py-4 ${
                    message.role === "user"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-gray-200"
                  }`}
                >

                  {message.role === "assistant" ? (

                  <ReactMarkdown

                  remarkPlugins={[remarkGfm]}

                  components={{

                  h1: ({children}) => (

                  <h1 className="text-3xl font-bold text-cyan-400 border-b border-cyan-500 pb-3 mb-6">
                  {children}
                  </h1>

                  ),

                  h2: ({children}) => (

                  <div className="bg-slate-800 border-l-4 border-cyan-500 rounded-lg px-4 py-3 my-6">

                  <h2 className="text-xl font-bold text-cyan-300">
                  {children}
                  </h2>

                  </div>

                  ),

                  h3: ({children}) => (

                  <h3 className="text-lg font-semibold text-cyan-200 mt-5 mb-3">
                  {children}
                  </h3>

                  ),

                  p: ({children}) => (

                  <p className="text-gray-300 leading-8 mb-4 text-[16px]">
                  {children}
                  </p>

                  ),

                  strong: ({children}) => (

                  <strong className="text-white font-semibold">
                  {children}
                  </strong>

                  ),

                  ul: ({children}) => (

                  <ul className="list-disc ml-6 space-y-3 text-gray-300">
                  {children}
                  </ul>

                  ),

                  ol: ({children}) => (

                  <ol className="list-decimal ml-6 space-y-3 text-gray-300">
                  {children}
                  </ol>

                  ),

                  li: ({children}) => (

                  <li className="leading-8">
                  {children}
                  </li>

                  ),

                  blockquote: ({children}) => (

                  <blockquote className="border-l-4 border-cyan-400 italic pl-5 my-5 text-slate-300">
                  {children}
                  </blockquote>

                  ),

                  code: ({children}) => (

                  <code className="bg-slate-950 text-cyan-300 rounded px-2 py-1 font-mono">
                  {children}
                  </code>

                  ),

                  pre: ({children}) => (

                  <pre className="bg-black border border-slate-700 rounded-xl p-5 overflow-x-auto my-6">
                  {children}
                  </pre>

                  ),

                  table: ({children}) => (

                  <div className="overflow-x-auto my-6">

                  <table className="w-full border-collapse rounded-xl overflow-hidden">
                  {children}
                  </table>

                  </div>

                  ),

                  thead: ({children}) => (

                  <thead className="bg-cyan-600 text-white">
                  {children}
                  </thead>

                  ),

                  tbody: ({children}) => (

                  <tbody className="bg-slate-800">
                  {children}
                  </tbody>

                  ),

                  tr: ({children}) => (

                  <tr className="border-b border-slate-700">
                  {children}
                  </tr>

                  ),

                  th: ({children}) => (

                  <th className="px-4 py-3 text-left">
                  {children}
                  </th>

                  ),

                  td: ({children}) => (

                  <td className="px-4 py-3 text-gray-300">
                  {children}
                  </td>

                  ),
                  }}

                  > 

                  {message.content}

                  </ReactMarkdown>

                  ) : (

                  <p className="whitespace-pre-wrap leading-7">
                  {message.content}
                  </p>

                  )}

                  {message.citations &&
                    message.citations.length > 0 && (

                    <div className="mt-5 border-t border-slate-600 pt-3">

                      <p className="font-bold text-cyan-400 mb-2">
                        Sources
                      </p>

                      {message.citations.map(
                        (citation, i) => (

                          <div
                            key={i}
                            className="bg-slate-700 rounded-lg p-3 mb-2"
                          >

                            <p>
                              📄 {citation.source}
                            </p>

                            <p>
                              Page {citation.page}
                            </p>

                            <p>
                              Score: {citation.score}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

            ))}

            {loading && (

              <div className="flex justify-start">

                <div className="bg-slate-800 rounded-2xl px-5 py-4">

                  <p className="text-gray-300 animate-pulse">
                    ScholarOS is thinking...
                  </p>

                </div>

              </div>

            )}

            <div ref={bottomRef}></div>

          </div>

          {/* Input */}

          <div className="border-t border-slate-700 p-5">

            <textarea
              rows={3}
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your uploaded documents..."
              className="w-full rounded-xl bg-slate-800 text-white border border-slate-700 p-4 outline-none resize-none"
            />

            <div className="flex justify-end mt-4">

              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition"
              >
                {loading
                  ? "Thinking..."
                  : "Send"}
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}



