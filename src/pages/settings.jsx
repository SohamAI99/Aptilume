import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/ui/AppHeader";
import AccountSection from "../components/ui/AccountSection";

export default function SettingsPage() {
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
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
          <AccountSection currentUser={currentUser} onLogout={handleLogout} />
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <p className="text-gray-700 mb-2">Name: John Doe</p>
            <p className="text-gray-700 mb-2">Email: john.doe@example.com</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition mt-4"
            >
              Save Changes
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-gray-700">Show my activity history</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-gray-700">Allow others to view my profile</label>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-gray-700">Notify me about new attempts</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-gray-700">Notify me about quiz updates</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}