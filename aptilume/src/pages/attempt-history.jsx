import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/ui/AppHeader";

export default function AttemptHistoryPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Attempt History</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Exam Attempts</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="text-gray-700">Exam: Math Fundamentals</span>
              <span className="text-green-600 font-medium">Status: Completed</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b">
              <span className="text-gray-700">Exam: English Proficiency</span>
              <span className="text-yellow-600 font-medium">Status: In Progress</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b">
              <span className="text-gray-700">Exam: Programming Basics</span>
              <span className="text-red-600 font-medium">Status: Not Started</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
