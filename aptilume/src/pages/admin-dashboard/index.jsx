import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AdminNavigation from './components/AdminNavigation';
import AnalyticsWidget from './components/AnalyticsWidget';
import ActivityFeed from './components/ActivityFeed';
import SystemHealthMonitor from './components/SystemHealthMonitor';
import UserManagementTable from './components/UserManagementTable';
import TestManagementPanel from './components/TestManagementPanel';
import ReportsGenerator from './components/ReportsGenerator';
import AdminAIAssistance from '../../components/ai/AdminAIAssistance';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { listenToUser, listenToQuizzes } from '../../utils/dbService';
import * as authService from '../../utils/authService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, quizzes, ai-assistance

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

  const mockUser = {
    id: currentUser?.uid || "1",
    name: currentUser?.name || currentUser?.displayName || "Admin",
    email: currentUser?.email || "",
    avatar: currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    userType: currentUser?.userType || "admin"
  };

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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {activeTab === 'dashboard' ? (
              <>
                {/* Welcome Section */}
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
              </>
            ) : activeTab === 'users' ? (
              <div className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">User Management</h1>
                  <Button iconName="Plus">Add User</Button>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">User</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Role</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Last Active</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5].map((item) => (
                          <tr key={item} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                                  alt="User" 
                                  className="w-8 h-8 rounded-full"
                                />
                                <span>John Doe</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">john.doe@example.com</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                Student
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs bg-success/10 text-success">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4">2 hours ago</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" iconName="Edit3" />
                                <Button variant="ghost" size="sm" iconName="Trash2" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeTab === 'quizzes' ? (
              <div className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">Quiz Management</h1>
                  <Button iconName="Plus">Create Quiz</Button>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">Quiz</th>
                          <th className="text-left py-3 px-4 font-medium">Creator</th>
                          <th className="text-left py-3 px-4 font-medium">Questions</th>
                          <th className="text-left py-3 px-4 font-medium">Difficulty</th>
                          <th className="text-left py-3 px-4 font-medium">Attempts</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizzes.slice(0, 5).map((quiz) => (
                          <tr key={quiz.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{quiz.title}</div>
                              <div className="text-sm text-muted-foreground">{quiz.description}</div>
                            </td>
                            <td className="py-3 px-4">Admin User</td>
                            <td className="py-3 px-4">{quiz.questionCount || 0}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                quiz.difficulty === 'easy' ? 'bg-success/20 text-success' :
                                quiz.difficulty === 'medium' ? 'bg-warning/20 text-warning' :
                                'bg-error/20 text-error'
                              }`}>
                                {quiz.difficulty}
                              </span>
                            </td>
                            <td className="py-3 px-4">{quiz.stats?.totalAttempts || 0}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs bg-success/10 text-success">
                                Published
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" iconName="Edit3" />
                                <Button variant="ghost" size="sm" iconName="BarChart3" />
                                <Button variant="ghost" size="sm" iconName="Trash2" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <h1 className="text-3xl font-bold mb-6">AI Assistance</h1>
                <AdminAIAssistance />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;