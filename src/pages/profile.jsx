import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/ui/AppHeader";
import AccountSection from "../components/ui/AccountSection";

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // Mock user data - in a real app this would come from context or props
  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    userType: "student"
  };
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // In a real app, you would call your auth service logout function here
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Account Section */}
      <header className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          </div>
          <AccountSection currentUser={currentUser} onLogout={handleLogout} />
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
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