import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  drillSuggestion: string;
  createdAt: string;
}

interface Session {
  id: string;
  imagePath: string;
  overallScore: number;
  strengths: string[];
  areasToImprove: string[];
  priorityFix: string;
  drillSuggestion: string;
  confidenceLevel: string;
  createdAt: string;
  chatMessages: ChatMessage[];
}

const SessionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/sessions/${id}`)
      .then((res) => setSession(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghost-600" />
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Session not found</p>
          <Link to="/sessions" className="text-ghost-600 hover:underline mt-2 inline-block">
            Back to History
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <Link
          to="/sessions"
          className="text-sm text-ghost-600 hover:underline inline-flex items-center gap-1 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to History
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="card overflow-hidden">
              <div className="relative">
                <img
                  src={session.imagePath}
                  alt="Session"
                  className="w-full object-cover max-h-[400px] bg-gray-100"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(session.createdAt)}
                </div>
                <span className={`badge ${
                  session.confidenceLevel === "High" ? "badge-green" :
                  session.confidenceLevel === "Medium" ? "badge-yellow" : "badge-red"
                }`}>
                  {session.confidenceLevel} Confidence
                </span>
              </div>
            </div>

            <div className="card p-6 space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ghost-400 to-ghost-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{session.overallScore}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Coaching Report</h2>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
                    <span>✅</span> Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {session.strengths?.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm">
                    <span>🎯</span> Areas to Improve
                  </h4>
                  <ul className="space-y-1.5">
                    {session.areasToImprove?.map((a, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-ghost-50 to-blue-50 border border-ghost-200">
                  <h4 className="font-semibold text-ghost-800 mb-1.5 flex items-center gap-2 text-sm">
                    <span>⭐</span> Priority Fix
                  </h4>
                  <p className="text-sm text-gray-700">{session.priorityFix}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-1.5 flex items-center gap-2 text-sm">
                    <span>🏏</span> Drill Suggestion
                  </h4>
                  <p className="text-sm text-gray-700">{session.drillSuggestion}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">AI Chat</h2>
                  <p className="text-sm text-gray-500">Follow-up coaching</p>
                </div>
                <Link
                  to={`/chat/${session.id}`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Ask a Question
                </Link>
              </div>

              {(!session.chatMessages || session.chatMessages.length === 0) ? (
                <div className="text-center py-12">
                  <div className="text-3xl mb-3">💬</div>
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Ask the AI coach for follow-up advice.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {session.chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-tr-sm">
                        <p className="text-xs text-gray-400 mb-1 font-medium">You</p>
                        <p className="text-sm text-gray-800">{msg.question}</p>
                      </div>
                      <div className="bg-ghost-50 p-3 rounded-2xl rounded-tl-sm">
                        <p className="text-xs text-ghost-500 mb-1 font-medium">Coach</p>
                        <p className="text-sm text-gray-800">{msg.answer}</p>
                        {msg.drillSuggestion && (
                          <p className="text-sm text-green-700 mt-2 font-medium flex items-center gap-1">
                            <span>🏏</span> Drill: {msg.drillSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SessionDetails;
