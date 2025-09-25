import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/ui/AppHeader";
import AccountSection from "../components/ui/AccountSection";
import StudentNavigation from "./student-dashboard/components/StudentNavigation";

export default function AttemptHistoryPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the proper student dashboard attempt history page
    navigate('/student-dashboard');
  }, [navigate]);
  
  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to attempt history...</p>
      </div>
    </div>
  );
}
