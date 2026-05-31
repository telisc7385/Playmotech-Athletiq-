import React from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const details = [
    { label: "Sport", value: user.sport, icon: "🏏" },
    { label: "Position / Role", value: user.role, icon: "🎯" },
    {
      label: "Experience Level",
      value: user.experienceLevel.charAt(0) + user.experienceLevel.slice(1).toLowerCase(),
      icon: "📈",
    },
    { label: "Email", value: user.email, icon: "✉️" },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your account information</p>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-ghost-500 to-ghost-700 px-8 py-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                <span className="text-4xl font-bold text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-ghost-100 text-sm mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg shrink-0">
                    {d.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{d.label}</p>
                    <p className="text-gray-900 font-semibold mt-0.5">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
