import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from './components/AdminNavigation';
import AccountSection from '../../components/ui/AccountSection';
import * as authService from '../../utils/authService';
import { listenToUser } from '../../utils/dbService';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RemoveUnwantedQuizzesButton from '../../components/admin/RemoveUnwantedQuizzesButton';
import SeedQuizzesButton from '../../components/admin/SeedQuizzesButton';
import ReplaceQuizzesButton from '../../components/admin/ReplaceQuizzesButton';
import AddCorrectQuizzesButton from '../../components/admin/AddCorrectQuizzesButton';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToUser(authService.getCurrentUserId(), (userData) => {
      setCurrentUser(userData);
    });

    return () => unsubscribe();
  }, []);

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
      <AdminNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {currentUser?.name || 'Admin'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your platform settings and content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Settings" size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">System Management</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Manage quizzes, users, and system settings
                </p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/admin/quizzes')}
                    icon={<Icon name="FileText" size={16} />}
                  >
                    Manage Quizzes
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/admin/users')}
                    icon={<Icon name="Users" size={16} />}
                  >
                    Manage Users
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/admin/reports')}
                    icon={<Icon name="BarChart3" size={16} />}
                  >
                    View Reports
                  </Button>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon name="Database" size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Data Management</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Seed data and clean up unwanted content
                </p>
                <div className="space-y-4">
                  <AddCorrectQuizzesButton />
                  <SeedQuizzesButton />
                  <ReplaceQuizzesButton />
                  <RemoveUnwantedQuizzesButton />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;