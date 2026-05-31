import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";

interface Message {
  id: string;
  question: string;
  answer: string;
  drillSuggestion: string;
  createdAt: string;
}

const AIChat: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get(`/sessions/${sessionId}`)
      .then((res) => setMessages(res.data.data.chatMessages || []))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!question.trim()) return;
    setSending(true);

    try {
      const res = await api.post(`/chat/${sessionId}`, { question });
      const newMsg = res.data.data;
      setMessages((prev) => [...prev, newMsg]);
      setQuestion("");
    } catch {
      // error handled by interceptor
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to={`/sessions/${sessionId}`}
          className="text-sm text-ghost-600 hover:underline flex items-center gap-1"
        >
          &larr; Back to Session
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Coach Chat</h1>
          <p className="text-gray-500">
            Ask follow-up questions about your coaching session
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 max-h-96 overflow-y-auto space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ghost-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">👋</p>
                <p className="mt-2">
                  Ask the AI coach anything about your session!
                </p>
                <p className="text-sm mt-1">
                  Example: "How do I improve my stance?"
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-xs text-gray-400 mb-1">You</p>
                      <p className="text-sm text-gray-800">{msg.question}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-ghost-50 p-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                      <p className="text-xs text-ghost-500 mb-1">Coach</p>
                      <p className="text-sm text-gray-800">{msg.answer}</p>
                      {msg.drillSuggestion && (
                        <p className="text-sm text-green-700 mt-2 font-medium">
                          🏏 Drill: {msg.drillSuggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the AI coach..."
                className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-ghost-500 focus:border-ghost-500 outline-none"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !question.trim()}
                className="bg-ghost-600 hover:bg-ghost-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
              >
                {sending ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIChat;
