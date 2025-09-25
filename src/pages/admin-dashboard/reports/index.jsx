import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/ui/AppHeader';
import AdminNavigation from '../components/AdminNavigation';
import ReportsGenerator from '../components/ReportsGenerator';
import * as authService from '../../../utils/authService';
import { getAdminAnalytics } from '../../../utils/analyticsService';
import Icon from '../../../components/AppIcon';
import AccountSection from '../../../components/ui/AccountSection';

const AdminReportsPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    userStats: {
      students: 0,
      teachers: 0,
      admins: 0
    },
    totalQuizzes: 0,
    publishedQuizzes: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
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

  // Fetch admin analytics
  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      try {
        const stats = await getAdminAnalytics('30d');
        setAdminStats(stats);
      } catch (error) {
        console.error('Error fetching admin analytics:', error);
      }
    };
    
    fetchAdminAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
                  <p className="text-muted-foreground mt-1">
                    View detailed reports and analytics for the platform
                  </p>
                </div>
              </div>
            </div>
            
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Icon name="Users" size={20} className="text-primary" />
                  </div>
                  <h3 className="font-medium">Total Students</h3>
                </div>
                <div className="text-3xl font-bold">{adminStats.userStats.students}</div>
                <div className="text-sm text-muted-foreground mt-1">+12 from last month</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Icon name="GraduationCap" size={20} className="text-accent" />
                  </div>
                  <h3 className="font-medium">Total Teachers</h3>
                </div>
                <div className="text-3xl font-bold">{adminStats.userStats.teachers}</div>
                <div className="text-sm text-muted-foreground mt-1">+3 from last month</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-success/10 p-2 rounded-lg">
                    <Icon name="FileText" size={20} className="text-success" />
                  </div>
                  <h3 className="font-medium">Total Quizzes</h3>
                </div>
                <div className="text-3xl font-bold">{adminStats.totalQuizzes}</div>
                <div className="text-sm text-muted-foreground mt-1">+8 from last month</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-warning/10 p-2 rounded-lg">
                    <Icon name="CheckCircle" size={20} className="text-warning" />
                  </div>
                  <h3 className="font-medium">Published Quizzes</h3>
                </div>
                <div className="text-3xl font-bold">{adminStats.publishedQuizzes}</div>
                <div className="text-sm text-muted-foreground mt-1">+5 from last month</div>
              </div>
            </div>
            
            <ReportsGenerator />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReportsPage;