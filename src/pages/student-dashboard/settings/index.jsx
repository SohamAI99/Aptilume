import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from '../components/StudentNavigation';
import AccountSection from '../../../components/ui/AccountSection';
import * as authService from '../../../utils/authService';
import StudentSettings from '../components/StudentSettings';

const StudentSettingsPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
      
      {/* Main Content Area with margin to accommodate sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <StudentSettings />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentSettingsPage;