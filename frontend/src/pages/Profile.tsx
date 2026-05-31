import React from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500">Your account information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-ghost-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-ghost-600">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.fullName}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">Sport</p>
              <p className="text-gray-800 mt-1">{user.sport}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Position / Role
              </p>
              <p className="text-gray-800 mt-1">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Experience Level
              </p>
              <p className="text-gray-800 mt-1">
                {user.experienceLevel.charAt(0) +
                  user.experienceLevel.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
