import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/ui/AppHeader";
import ProfileDropdown from "../components/ui/ProfileDropdown";

export default function SettingsPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
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