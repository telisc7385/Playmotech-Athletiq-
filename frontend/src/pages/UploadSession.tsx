import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";

const UploadSession: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/png", "image/jpeg"].includes(selected.type)) {
      setError("Only PNG and JPG files are allowed");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/sessions/analyze", formData);
      setResult(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upload Session</h1>
          <p className="text-gray-500">
            Upload a photo of your cricket stance for AI coaching analysis
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-ghost-400 transition cursor-pointer"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">📸</div>
                <p className="text-gray-500">
                  Click to upload your cricket stance photo
                </p>
                <p className="text-sm text-gray-400">PNG or JPG, max 5MB</p>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {file && !result && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-ghost-600 hover:bg-ghost-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Analyzing with AI..." : "Analyze Stance"}
            </button>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Coaching Report
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceColor(result.confidenceLevel)}`}
                >
                  {result.confidenceLevel} Confidence
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-ghost-600">
                  {result.overallScore}/10
                </div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {result.strengths?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Areas to Improve
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {result.areasToImprove?.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-ghost-50 p-4 rounded-lg">
                <p className="font-medium text-ghost-800">Priority Fix</p>
                <p className="text-sm text-gray-700 mt-1">
                  {result.priorityFix}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-medium text-green-800">Drill Suggestion</p>
                <p className="text-sm text-gray-700 mt-1">
                  {result.drillSuggestion}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/sessions/${result.id}`)}
                  className="flex-1 bg-ghost-600 hover:bg-ghost-700 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  View Full Report
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Analyze Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UploadSession;
