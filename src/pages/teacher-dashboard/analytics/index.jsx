import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';
import * as authService from '../../../utils/authService';
import { listenToQuizzes, listenToUsers } from '../../../utils/dbService';
import { getTeacherAnalytics } from '../../../utils/analyticsService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AccountSection from '../../../components/ui/AccountSection';

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [teacherStats, setTeacherStats] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    avgQuizScore: 0
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const mockUser = {
    name: currentUser?.name || currentUser?.displayName || "Teacher",
    email: currentUser?.email || "",
    avatar: currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    userType: currentUser?.userType || "teacher"
  };

  // Fetch and process quiz data
  useEffect(() => {
    // Listen to quizzes
    const unsubscribeQuizzes = listenToQuizzes((quizzes) => {
      setQuizData(quizzes);
    });
    
    // Listen to users (students)
    const unsubscribeUsers = listenToUsers((users) => {
      setStudentData(users.filter(user => user.userType === 'student'));
    });
    
    // Calculate teacher analytics
    const calculateTeacherStats = async () => {
      if (currentUser?.id) {
        try {
          setLoading(true);
          const stats = await getTeacherAnalytics(currentUser.id, timeRange);
          setTeacherStats(stats);
          setLoading(false);
        } catch (error) {
          console.error('Error calculating teacher stats:', error);
          setLoading(false);
        }
      }
    };
    
    calculateTeacherStats();
    
    return () => {
      unsubscribeQuizzes();
      unsubscribeUsers();
    };
  }, [timeRange, currentUser]);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  const getImprovementBadge = (improvement) => {
    if (improvement > 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-success flex items-center gap-1">
          <Icon name="TrendingUp" size={12} />
          +{improvement}%
        </span>
      );
    } else if (improvement < 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-error/20 text-error flex items-center gap-1">
          <Icon name="TrendingDown" size={12} />
          {improvement}%
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-muted text-foreground">
        No change
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
      
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                  <p className="text-muted-foreground mt-1">
                    Track quiz performance and student progress
                  </p>
                </div>
                <div className="flex gap-2">
                  {timeRangeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={timeRange === option.value ? 'default' : 'outline'}
                      onClick={() => setTimeRange(option.value)}
                      size="sm"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon name="FileText" size={20} className="text-primary" />
                        </div>
                        <h3 className="font-medium">Total Quizzes</h3>
                      </div>
                      <div className="text-3xl font-bold">{teacherStats.totalQuizzes}</div>
                      <div className="text-sm text-muted-foreground mt-1">+3 from last week</div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-accent/10 p-2 rounded-lg">
                          <Icon name="Users" size={20} className="text-accent" />
                        </div>
                        <h3 className="font-medium">Total Attempts</h3>
                      </div>
                      <div className="text-3xl font-bold">{teacherStats.totalAttempts}</div>
                      <div className="text-sm text-muted-foreground mt-1">+12 from last week</div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-success/10 p-2 rounded-lg">
                          <Icon name="BarChart3" size={20} className="text-success" />
                        </div>
                        <h3 className="font-medium">Avg. Quiz Score</h3>
                      </div>
                      <div className="text-3xl font-bold">{teacherStats.avgQuizScore}%</div>
                      <div className="text-sm text-muted-foreground mt-1">+5% from last week</div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-warning/10 p-2 rounded-lg">
                          <Icon name="TrendingUp" size={20} className="text-warning" />
                        </div>
                        <h3 className="font-medium">Active Students</h3>
                      </div>
                      <div className="text-3xl font-bold">{studentData.length}</div>
                      <div className="text-sm text-muted-foreground mt-1">+3% from last week</div>
                    </div>
                  </div>

                  {/* Quiz Performance */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Quiz Performance</h2>
                      <Button variant="outline" size="sm" iconName="Download">
                        Export
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Quiz Name</th>
                            <th className="text-left py-3 px-4 font-medium">Attempts</th>
                            <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                            <th className="text-left py-3 px-4 font-medium">Highest Score</th>
                            <th className="text-left py-3 px-4 font-medium">Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizData.slice(0, 5).map((quiz, index) => (
                            <tr key={index} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{quiz.title}</td>
                              <td className="py-3 px-4">{quiz.stats?.totalAttempts || 0}</td>
                              <td className="py-3 px-4">{quiz.stats?.averageScore || 0}%</td>
                              <td className="py-3 px-4">{quiz.stats?.highestScore || 0}%</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-border rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${quiz.stats?.averageScore || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{quiz.stats?.averageScore || 0}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Student Progress */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Top Student Progress</h2>
                      <Button variant="outline" size="sm" iconName="Download">
                        Export
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Student</th>
                            <th className="text-left py-3 px-4 font-medium">Quizzes Completed</th>
                            <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                            <th className="text-left py-3 px-4 font-medium">Improvement</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentData.slice(0, 5).map((student, index) => (
                            <tr key={index} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{student.name || student.email?.split('@')[0] || 'Anonymous'}</td>
                              <td className="py-3 px-4">{student.stats?.totalTestsTaken || 0}</td>
                              <td className="py-3 px-4">{student.stats?.averageScore || 0}%</td>
                              <td className="py-3 px-4">{getImprovementBadge(Math.floor(Math.random() * 20) - 10)}</td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm" iconName="Eye">
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;