import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";

const UploadSession: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateFile = (selected: File) => {
    if (!["image/png", "image/jpeg"].includes(selected.type)) {
      setError("Only PNG and JPG files are allowed");
      return false;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return false;
    }
    return true;
  };

  const handleFile = (selected: File) => {
    if (!validateFile(selected)) return;
    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected) handleFile(selected);
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

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="page-title">Upload Session</h1>
          <p className="page-subtitle">
            Upload a photo of your cricket stance for AI coaching analysis
          </p>
        </div>

        {!result ? (
          <div className="card p-8 space-y-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-ghost-500 bg-ghost-50/50"
                  : preview
                    ? "border-ghost-300 bg-ghost-50/30"
                    : "border-gray-200 hover:border-ghost-300 hover:bg-gray-50/50"
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-72 mx-auto rounded-xl shadow-sm"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); resetForm(); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-ghost-100 to-ghost-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-ghost-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">
                      Drop your photo here, or{" "}
                      <span className="text-ghost-600 underline underline-offset-2">browse</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      PNG or JPG, max 5MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-200">
                <span>⚠</span>
                {error}
              </div>
            )}

            {file && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Stance
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="card p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ghost-400 to-ghost-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{result.overallScore}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Coaching Report</h2>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>
              </div>
              <span className={`badge ${
                result.confidenceLevel === "High" ? "badge-green" :
                result.confidenceLevel === "Medium" ? "badge-yellow" : "badge-red"
              }`}>
                {result.confidenceLevel} Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <span>✅</span> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths?.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <span>🎯</span> Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {result.areasToImprove?.map((a: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-ghost-50 to-blue-50 border border-ghost-200">
                  <h4 className="font-semibold text-ghost-800 mb-2 flex items-center gap-2">
                    <span>⭐</span> Priority Fix
                  </h4>
                  <p className="text-sm text-gray-700">{result.priorityFix}</p>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <span>🏏</span> Drill Suggestion
                  </h4>
                  <p className="text-sm text-gray-700">{result.drillSuggestion}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate(`/sessions/${result.id}`)}
                className="btn-primary flex-1"
              >
                View Full Report
              </button>
              <button
                onClick={resetForm}
                className="btn-secondary flex-1"
              >
                Analyze Another
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadSession;
