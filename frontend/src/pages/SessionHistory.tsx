import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";

interface Session {
  id: string;
  imagePath: string;
  overallScore: number;
  priorityFix: string;
  createdAt: string;
}

const SessionHistory: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/sessions")
      .then((res) => setSessions(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Session History</h1>
            <p className="page-subtitle">All your coaching sessions</p>
          </div>
          <Link to="/upload" className="btn-primary hidden sm:inline-flex items-center gap-2">
            <span>+</span> New Session
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-500 mb-6">
              Complete your first analysis to see it here.
            </p>
            <Link to="/upload" className="btn-primary inline-flex">
              Upload Your First Photo
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => {
              const score = session.overallScore;
              return (
                <Link
                  key={session.id}
                  to={`/sessions/${session.id}`}
                  className="card-hover p-4 flex items-center gap-5 group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={session.imagePath}
                      alt="Session"
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-sm text-gray-500">{formatDate(session.createdAt)}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{formatTime(session.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {session.priorityFix}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        score >= 7 ? "text-green-600" :
                        score >= 4 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {score}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">/10</div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SessionHistory;
