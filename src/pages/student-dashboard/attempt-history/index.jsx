import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from '../components/StudentNavigation';
import AccountSection from '../../../components/ui/AccountSection';
import AttemptHistory from '../components/AttemptHistory';
import * as authService from '../../../utils/authService';

const StudentAttemptHistory = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      navigate('/authentication-login-register');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading attempt history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Attempt History</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <AttemptHistory />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentAttemptHistory;