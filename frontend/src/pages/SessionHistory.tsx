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
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 7) return "text-green-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Session History</h1>
          <p className="text-gray-500">All your coaching sessions</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border text-center">
            <p className="text-gray-500 text-lg">No sessions yet.</p>
            <Link
              to="/upload"
              className="text-ghost-600 hover:underline font-medium"
            >
              Upload your first photo
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Link
                key={session.id}
                to={`/sessions/${session.id}`}
                className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4 hover:shadow-md transition"
              >
                <img
                  src={`http://localhost:5000/${session.imagePath}`}
                  alt="Session"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {formatDate(session.createdAt)}
                    </p>
                    <p
                      className={`text-lg font-bold ${scoreColor(session.overallScore)}`}
                    >
                      {session.overallScore}/10
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 truncate">
                    {session.priorityFix}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SessionHistory;
