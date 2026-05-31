import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";
import { getToken } from "../api/client";

interface Message {
  id: string;
  question: string;
  answer: string;
  drillSuggestion: string;
  createdAt: string;
}

interface TempMessage {
  question: string;
  answer: string;
  drillSuggestion: string;
}

const AIChat: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState<TempMessage | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const questionRef = useRef("");

  useEffect(() => {
    api
      .get(`/sessions/${sessionId}`)
      .then((res) => setMessages(res.data.data.chatMessages || []))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, temp]);

  const handleSend = async () => {
    const q = questionRef.current.trim();
    if (!q || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setQuestion("");
    questionRef.current = "";
    setTemp({ question: q, answer: "...", drillSuggestion: "" });

    try {
      const token = getToken();
      const res = await fetch(`/api/chat/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        setTemp({ question: q, answer: "Failed to get response. Please try again.", drillSuggestion: "" });
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.token) {
                setTemp((prev) =>
                  prev
                    ? {
                        ...prev,
                        answer:
                          prev.answer === "..."
                            ? data.token
                            : prev.answer + data.token,
                      }
                    : prev
                );
              } else if (data.done) {
                setMessages((prev) => [...prev, data.message]);
                setTemp(null);
              } else if (data.error) {
                setTemp((prev) =>
                  prev
                    ? { ...prev, answer: data.error }
                    : prev
                );
              }
            } catch {
              // skip malformed events
            }
          }
        }
      }
    } catch {
      setTemp({ question: q, answer: "Connection error. Please try again.", drillSuggestion: "" });
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendingRef.current) handleSend();
    }
  };

  const renderCoachAnswer = (answer: string) => {
    if (answer === "...") {
      return (
        <span className="inline-flex gap-1">
          <span className="w-2 h-2 bg-ghost-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-ghost-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-ghost-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </span>
      );
    }
    return <p className="text-sm text-gray-800 whitespace-pre-wrap">{answer}</p>;
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
            ) : messages.length === 0 && !temp ? (
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
              <>
                {messages.map((msg) => (
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
                        {renderCoachAnswer(msg.answer)}
                        {msg.drillSuggestion && (
                          <p className="text-sm text-green-700 mt-2 font-medium">
                            🏏 Drill: {msg.drillSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {temp && (
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                        <p className="text-xs text-gray-400 mb-1">You</p>
                        <p className="text-sm text-gray-800">{temp.question}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-ghost-50 p-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                        <p className="text-xs text-ghost-500 mb-1">Coach</p>
                        {renderCoachAnswer(temp.answer)}
                        {temp.drillSuggestion && (
                          <p className="text-sm text-green-700 mt-2 font-medium">
                            🏏 Drill: {temp.drillSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => { setQuestion(e.target.value); questionRef.current = e.target.value; }}
                onKeyDown={handleKeyDown}
                placeholder={sending ? "Waiting for response..." : "Ask the AI coach..."}
                className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-ghost-500 focus:border-ghost-500 outline-none"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !question.trim()}
                className="bg-ghost-600 hover:bg-ghost-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
              >
                {sending ? (
                  <span className="inline-flex gap-0.5">
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIChat;
