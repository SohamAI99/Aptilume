import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AdminNavigation from './components/AdminNavigation';
import AnalyticsWidget from './components/AnalyticsWidget';
import ActivityFeed from './components/ActivityFeed';
import SystemHealthMonitor from './components/SystemHealthMonitor';
// Removed embedded components - using separate pages now
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { listenToUser, listenToQuizzes, listenToUsers } from '../../utils/dbService';
import * as authService from '../../utils/authService';
import AccountSection from '../../components/ui/AccountSection';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userUnsubscribe, quizzesUnsubscribe, usersUnsubscribe;
    
    const setupListeners = async () => {
      try {
        // Listen to current user
        const user = await authService.getCurrentUser();
        if (user?.uid) {
          userUnsubscribe = listenToUser(user.uid, (userData) => {
            setCurrentUser(userData);
          });
        }
        
        // Listen to all quizzes (admin has access to all)
        quizzesUnsubscribe = listenToQuizzes((quizData) => {
          setQuizzes(quizData);
        });
        
        // Listen to all users
        usersUnsubscribe = listenToUsers((usersData) => {
          setUsers(usersData);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up listeners:', error);
        setLoading(false);
      }
    };
    
    setupListeners();
    
    return () => {
      if (userUnsubscribe) userUnsubscribe();
      if (quizzesUnsubscribe) quizzesUnsubscribe();
      if (usersUnsubscribe) usersUnsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      navigate('/authentication-login-register');
    }
  };

  const handleManageUsers = () => {
    // Navigate to user management page
    navigate('/admin/users');
  };

  const handleManageQuizzes = () => {
    // Navigate to quiz management page
    navigate('/admin/quizzes');
  };

  const handleViewReports = () => {
    // Navigate to reports page
    navigate('/admin/reports');
  };

  const handleSeedQuizzes = () => {
    // Navigate to seed quizzes page
    navigate('/seed-quizzes');
  };

  const handleDebugQuiz = () => {
    // Navigate to debug quiz page
    navigate('/debug-quiz');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate platform statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive !== false).length;
  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter(quiz => quiz.isPublished).length;
  const totalAttempts = quizzes.reduce((acc, quiz) => acc + (quiz.stats?.totalAttempts || 0), 0);
  const avgPlatformScore = quizzes.length > 0 
    ? Math.round(quizzes.reduce((acc, quiz) => acc + (quiz.stats?.averageScore || 0), 0) / quizzes.length)
    : 0;

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
        
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="max-w-full mx-auto px-4 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, {currentUser?.name || currentUser?.displayName || 'Admin'}!
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage the platform and oversee all activities
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="text-muted-foreground text-sm mt-1">Total Users</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">{activeUsers}</div>
                <div className="text-muted-foreground text-sm mt-1">Active Users</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">{totalQuizzes}</div>
                <div className="text-muted-foreground text-sm mt-1">Total Quizzes</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">{totalAttempts}</div>
                <div className="text-muted-foreground text-sm mt-1">Total Attempts</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {users.slice(0, 5).map((user, index) => (
                  <div key={user.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50">
                    <div className="bg-muted/50 p-2 rounded-full">
                      <Icon name="User" size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name || user.email?.split('@')[0] || 'User'}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.userType === 'admin' ? 'Admin' : user.userType === 'teacher' ? 'Teacher' : 'Student'} registered
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">
                      {user.createdAt ? new Date(user.createdAt?.toDate?.()).toLocaleDateString() : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon name="Users" size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">User Management</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Manage users, roles, and permissions across the platform
                  </p>
                  <Button onClick={handleManageUsers} variant="outline" fullWidth>
                    Manage Users
                  </Button>
                </div>
                
                <div className="rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Icon name="FileText" size={24} className="text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold">Quiz Management</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Create, edit, and manage all quizzes on the platform
                  </p>
                  <Button onClick={handleManageQuizzes} variant="outline" fullWidth>
                    Manage Quizzes
                  </Button>
                </div>
                
                <div className="rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-success/10 p-3 rounded-lg">
                      <Icon name="BarChart3" size={24} className="text-success" />
                    </div>
                    <h3 className="text-lg font-semibold">Reports & Analytics</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    View detailed reports and analytics for the platform
                  </p>
                  <Button onClick={handleViewReports} variant="outline" fullWidth>
                    View Reports
                  </Button>
                </div>
                
                <div className="rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-warning/10 p-3 rounded-lg">
                      <Icon name="Database" size={24} className="text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold">Seed Quizzes</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Create or update the two required quizzes (Microsoft and Meta)
                  </p>
                  <Button onClick={handleSeedQuizzes} variant="outline" fullWidth>
                    Seed Quizzes
                  </Button>
                </div>
                
                <div className="rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-destructive/10 p-3 rounded-lg">
                      <Icon name="Bug" size={24} className="text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold">Debug Quiz</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Inspect quiz data in the database for troubleshooting
                  </p>
                  <Button onClick={handleDebugQuiz} variant="outline" fullWidth>
                    Debug Quiz
                  </Button>
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