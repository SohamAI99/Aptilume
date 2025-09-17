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
import { listenToUser, listenToQuizzes } from '../../utils/dbService';
import * as authService from '../../utils/authService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    let userUnsubscribe, quizzesUnsubscribe;
    
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

  const handleAIAssistance = () => {
    // Navigate to AI assistance page
    navigate('/admin/ai-assistance');
  };

  const handleProfile = () => {
    // Navigate to profile page
    navigate('/profile');
  };

  const handleSettings = () => {
    // Navigate to settings page
    navigate('/settings');
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

  const mockUser = {
    id: currentUser?.uid || "1",
    name: currentUser?.name || currentUser?.displayName || "Admin",
    email: currentUser?.email || "",
    avatar: currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    userType: currentUser?.userType || "admin"
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Welcome Section with Profile */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, {mockUser?.name}!
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage the platform and oversee all activities
                  </p>
                </div>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <img
                      src={mockUser?.avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-foreground hidden md:inline">
                      {mockUser?.name}
                    </span>
                    <Icon 
                      name={showProfileDropdown ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <img
                            src={mockUser?.avatar}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground">{mockUser?.name}</p>
                            <p className="text-sm text-muted-foreground">{mockUser?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleProfile();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Icon name="User" size={16} />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            handleSettings();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Icon name="Settings" size={16} />
                          Settings
                        </button>
                        <hr className="my-1 border-border" />
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Icon name="LogOut" size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-muted-foreground text-sm mt-1">Total Users</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">{quizzes.length}</div>
                <div className="text-muted-foreground text-sm mt-1">Total Quizzes</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">8,421</div>
                <div className="text-muted-foreground text-sm mt-1">Total Attempts</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold">76%</div>
                <div className="text-muted-foreground text-sm mt-1">Avg. Platform Score</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
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
              
              <div className="glass-card rounded-2xl p-6">
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
              
              <div className="glass-card rounded-2xl p-6">
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
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple/10 p-3 rounded-lg">
                    <Icon name="Sparkles" size={24} className="text-purple" />
                  </div>
                  <h3 className="text-lg font-semibold">AI Assistance</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Leverage AI to create quizzes and explain concepts
                </p>
                <Button onClick={handleAIAssistance} variant="outline" fullWidth>
                  AI Assistant
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50">
                    <div className="bg-muted/50 p-2 rounded-full">
                      <Icon name="Activity" size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">User Registration</div>
                      <div className="text-sm text-muted-foreground">New user John Doe registered 2 hours ago</div>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">2h ago</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;