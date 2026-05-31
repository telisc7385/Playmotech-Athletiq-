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
          className="text-sm text-ghost-600 hover:underline inline-flex items-center gap-1 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Session
        </Link>

        <div>
          <h1 className="page-title">AI Coach Chat</h1>
          <p className="page-subtitle">
            Ask follow-up questions about your coaching session
          </p>
        </div>

        <div className="card flex flex-col h-[600px]">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghost-600" />
              </div>
            ) : messages.length === 0 && !temp ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ghost-100 to-ghost-200 flex items-center justify-center text-3xl mb-4">
                  💬
                </div>
                <p className="text-gray-700 font-medium">Ask the AI coach anything!</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  Ask about technique, drills, or how to improve based on your session.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200/80 p-3.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                        <p className="text-[11px] text-gray-400 mb-1 font-semibold tracking-wider uppercase">You</p>
                        <p className="text-sm text-gray-800">{msg.question}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-br from-ghost-50 to-blue-50/80 p-3.5 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                        <p className="text-[11px] text-ghost-500 mb-1 font-semibold tracking-wider uppercase">Coach</p>
                        {renderCoachAnswer(msg.answer)}
                        {msg.drillSuggestion && (
                          <p className="text-sm text-green-700 mt-2 font-medium flex items-center gap-1.5 pt-2 border-t border-ghost-200/50">
                            <span>🏏</span> Drill: {msg.drillSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {temp && (
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200/80 p-3.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                        <p className="text-[11px] text-gray-400 mb-1 font-semibold tracking-wider uppercase">You</p>
                        <p className="text-sm text-gray-800">{temp.question}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-br from-ghost-50 to-blue-50/80 p-3.5 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                        <p className="text-[11px] text-ghost-500 mb-1 font-semibold tracking-wider uppercase">Coach</p>
                        {renderCoachAnswer(temp.answer)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-100 p-4 bg-gray-50/50 rounded-b-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => { setQuestion(e.target.value); questionRef.current = e.target.value; }}
                onKeyDown={handleKeyDown}
                placeholder={sending ? "Waiting for response..." : "Ask the AI coach..."}
                className="input-field flex-1"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !question.trim()}
                className="btn-primary px-5"
              >
                {sending ? (
                  <span className="inline-flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
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
