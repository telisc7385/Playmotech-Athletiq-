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
          <p className="text-gray-500">Session not found</p>
        </div>
      </Layout>
    );
  }

  const confidenceColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-red-600 bg-red-50";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <Link
          to="/sessions"
          className="text-sm text-ghost-600 hover:underline flex items-center gap-1"
        >
          &larr; Back to History
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <img
                src={`http://localhost:5000/${session.imagePath}`}
                alt="Session"
                className="w-full rounded-lg object-cover max-h-80"
              />
              <p className="text-sm text-gray-500 mt-3">
                Uploaded on {formatDate(session.createdAt)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Coaching Report
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceColor(session.confidenceLevel)}`}
                >
                  {session.confidenceLevel}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-ghost-600">
                  {session.overallScore}/10
                </div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {session.strengths?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Areas to Improve
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {session.areasToImprove?.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-ghost-50 p-4 rounded-lg">
                <p className="font-medium text-ghost-800">Priority Fix</p>
                <p className="text-sm text-gray-700 mt-1">
                  {session.priorityFix}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-medium text-green-800">Drill Suggestion</p>
                <p className="text-sm text-gray-700 mt-1">
                  {session.drillSuggestion}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                AI Chat History
              </h2>
              <Link
                to={`/chat/${session.id}`}
                className="text-sm bg-ghost-600 hover:bg-ghost-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Ask a Question
              </Link>
            </div>

            {(!session.chatMessages || session.chatMessages.length === 0) ? (
              <div className="text-center py-12 text-gray-500">
                <p>No chat messages yet.</p>
                <p className="text-sm mt-1">
                  Ask the AI coach for follow-up advice.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {session.chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">You</p>
                      <p className="text-sm text-gray-800">{msg.question}</p>
                    </div>
                    <div className="bg-ghost-50 p-3 rounded-lg">
                      <p className="text-xs text-ghost-500 mb-1">Coach</p>
                      <p className="text-sm text-gray-800">{msg.answer}</p>
                      {msg.drillSuggestion && (
                        <p className="text-sm text-green-700 mt-2 font-medium">
                          Drill: {msg.drillSuggestion}
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
    </Layout>
  );
};

export default SessionDetails;
