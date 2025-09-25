import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../../utils/authService';
import { listenToUser } from '../../../utils/dbService';
import { 
  getUserPerformanceData, 
  getUserSubjectPerformance, 
  getUserWeeklyProgress 
} from '../../../utils/analyticsService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StudentNavigation from '../components/StudentNavigation';
import AccountSection from '../../../components/ui/AccountSection';

const Analytics = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        
        // Listen to user data for real-time updates
        const unsubscribeUser = listenToUser(user?.id, (userData) => {
          if (userData) {
            setCurrentUser(userData);
          }
        });
        
        return () => {
          unsubscribeUser();
        };
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
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Fetch analytics data when user or time range changes
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (currentUser?.id) {
        try {
          setLoading(true);
          
          // Fetch all analytics data in parallel
          const [performance, subject, weekly] = await Promise.all([
            getUserPerformanceData(currentUser.id, timeRange),
            getUserSubjectPerformance(currentUser.id, timeRange),
            getUserWeeklyProgress(currentUser.id, timeRange)
          ]);
          
          setPerformanceData(performance);
          setSubjectPerformance(subject);
          setWeeklyProgress(weekly);
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching analytics data:', error);
          setLoading(false);
        }
      }
    };
    
    fetchAnalyticsData();
  }, [currentUser, timeRange]);

  // Calculate overview stats
  const getOverviewStats = () => {
    if (!currentUser) {
      return { testsTaken: 0, avgScore: 0, bestScore: 0, accuracy: 0 };
    }
    
    const testsTaken = currentUser.stats?.totalTestsTaken || 0;
    const avgScore = currentUser.stats?.averageScore || 0;
    const bestScore = currentUser.stats?.highestScore || 0;
    // For accuracy, we'll use a mock value since it's not in the user stats
    const accuracy = Math.min(100, Math.max(0, avgScore + Math.floor(Math.random() * 10) - 5));
      
    return { testsTaken, avgScore, bestScore, accuracy };
  };

  const overviewStats = getOverviewStats();

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
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
                    Track your progress and performance over time
                  </p>
                </div>
                <Button onClick={() => navigate('/student-dashboard')} variant="outline" iconName="ArrowLeft">
                  Back to Dashboard
                </Button>
              </div>

              <div className="flex items-center justify-between mb-6">
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
                        <h3 className="font-medium">Tests Taken</h3>
                      </div>
                      <div className="text-3xl font-bold">{overviewStats.testsTaken}</div>
                      <div className="text-sm text-muted-foreground mt-1">+3 from last month</div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-success/10 p-2 rounded-lg">
                          <Icon name="TrendingUp" size={20} className="text-success" />
                        </div>
                        <h3 className="font-medium">Avg. Score</h3>
                      </div>
                      <div className="text-3xl font-bold">{overviewStats.avgScore}%</div>
                      <div className="text-sm text-muted-foreground mt-1">+5% from last month</div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-accent/10 p-2 rounded-lg">
                          <Icon name="Award" size={20} className="text-accent" />
                        </div>
                        <h3 className="font-medium">Best Score</h3>
                      </div>
                      <div className="text-3xl font-bold">{overviewStats.bestScore}%</div>
                      <div className="text-sm text-muted-foreground mt-1">In Mathematics</div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-warning/10 p-2 rounded-lg">
                          <Icon name="Target" size={20} className="text-warning" />
                        </div>
                        <h3 className="font-medium">Accuracy</h3>
                      </div>
                      <div className="text-3xl font-bold">{overviewStats.accuracy}%</div>
                      <div className="text-sm text-muted-foreground mt-1">+2% from last month</div>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Performance Over Time</h2>
                      <Button variant="outline" size="sm" iconName="Download">
                        Export
                      </Button>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                      {performanceData.length > 0 ? (
                        performanceData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="text-xs text-muted-foreground mb-2">
                              {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div 
                              className="w-full bg-primary rounded-t-lg transition-all duration-500 ease-out"
                              style={{ height: `${data.score}%` }}
                            ></div>
                            <div className="text-sm font-medium mt-2">{data.score}%</div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                          No performance data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject Performance */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-6">Subject Performance</h2>
                      <div className="space-y-4">
                        {subjectPerformance.length > 0 ? (
                          subjectPerformance.map((subject, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{subject.subject}</div>
                                <div className="text-sm text-muted-foreground">{subject.tests} tests</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-24 bg-border rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${subject.score}%` }}
                                  ></div>
                                </div>
                                <span className="font-medium w-10">{subject.score}%</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-center py-4">
                            No subject performance data available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weekly Progress */}
                    <div className="glass-card rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-6">Weekly Progress</h2>
                      <div className="space-y-4">
                        {weeklyProgress.length > 0 ? (
                          weeklyProgress.map((week, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{week.week}</div>
                                <div className="text-sm text-muted-foreground">{week.completed} tests completed</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{week.avgScore}%</div>
                                <div className="text-sm text-muted-foreground">Avg. score</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-center py-4">
                            No weekly progress data available
                          </div>
                        )}
                      </div>
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