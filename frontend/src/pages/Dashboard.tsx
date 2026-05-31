import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/client";
import Layout from "../components/Layout";

interface Stats {
  totalSessions: number;
  averageScore: number;
  scores: { date: string; score: number }[];
  trend: "up" | "down" | "stable";
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghost-600" />
        </div>
      </Layout>
    );
  }

  const trendConfig = {
    up: { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Improving", icon: "↑" },
    down: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Declining", icon: "↓" },
    stable: { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", label: "Stable", icon: "→" },
  }[stats?.trend || "stable"];

  const statsCards = [
    { label: "Total Sessions", value: stats?.totalSessions ?? 0, icon: "📋", color: "from-ghost-400 to-ghost-600" },
    { label: "Average Score", value: `${stats?.averageScore ?? 0}/10`, icon: "⭐", color: "from-amber-400 to-orange-500" },
    { label: "Trend", value: trendConfig.label, icon: trendConfig.icon, color: stats?.trend === "up" ? "from-green-400 to-emerald-500" : stats?.trend === "down" ? "from-red-400 to-rose-500" : "from-gray-400 to-gray-500" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Your coaching progress at a glance</p>
          </div>
          <Link
            to="/upload"
            className="btn-primary hidden sm:inline-flex items-center gap-2"
          >
            <span>+</span> New Session
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {statsCards.map((card) => (
            <div key={card.label} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-lg`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {stats && stats.scores.length > 0 ? (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Score History</h2>
                <p className="text-sm text-gray-500">Your performance over time</p>
              </div>
              <span className="badge-blue">{stats.scores.length} sessions</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={stats.scores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4c6ef5"
                  strokeWidth={2.5}
                  dot={{ fill: "#4c6ef5", strokeWidth: 2, stroke: "#fff", r: 5 }}
                  activeDot={{ r: 7, fill: "#4c6ef5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🏏</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-500 mb-6">
              Upload your first photo to get AI-powered coaching feedback.
            </p>
            <Link to="/upload" className="btn-primary inline-flex">
              Upload Your First Photo
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
