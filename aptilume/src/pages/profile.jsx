import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/ui/AppHeader";
import ProfileDropdown from "../components/ui/ProfileDropdown";

export default function ProfilePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <ProfileDropdown />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <p className="text-gray-700">Name: John Doe</p>
            <p className="text-gray-700">Email: john.doe@example.com</p>
            <p className="text-gray-700">Joined: 2025-08-01</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <button 
              onClick={() => navigate('/settings')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Go to Settings
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Attempt History</h2>
            <button 
              onClick={() => navigate('/attempt-history')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
            >
              View Attempt History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}