import React, { useEffect, useState } from "react";
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

  const trendColor =
    stats?.trend === "up"
      ? "text-green-600"
      : stats?.trend === "down"
        ? "text-red-600"
        : "text-gray-600";

  const trendIcon =
    stats?.trend === "up" ? "↑" : stats?.trend === "down" ? "↓" : "→";

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Your coaching progress at a glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-sm text-gray-500 font-medium">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats?.totalSessions}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-sm text-gray-500 font-medium">Average Score</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats?.averageScore}/10
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <p className="text-sm text-gray-500 font-medium">Trend</p>
            <p className={`text-3xl font-bold mt-2 ${trendColor}`}>
              {trendIcon}{" "}
              {stats?.trend === "up"
                ? "Improving"
                : stats?.trend === "down"
                  ? "Declining"
                  : "Stable"}
            </p>
          </div>
        </div>

        {stats && stats.scores.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Score History
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.scores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4c6ef5"
                  strokeWidth={2}
                  dot={{ fill: "#4c6ef5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {(!stats || stats.scores.length === 0) && (
          <div className="bg-white rounded-xl shadow-sm p-12 border text-center">
            <p className="text-gray-500 text-lg">
              No sessions yet.{" "}
              <a href="/upload" className="text-ghost-600 hover:underline font-medium">
                Upload your first photo
              </a>{" "}
              to get started.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
