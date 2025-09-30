import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import * as authService from '../../utils/authService';
import { listenToLeaderboardUsers, getAttemptsByUser } from '../../utils/dbService';
import StudentNavigation from '../student-dashboard/components/StudentNavigation';
import AccountSection from '../../components/ui/AccountSection';
import { Trophy, Calendar, BarChart3, Target, TrendingUp, Award, Clock } from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // all, week, month
  const [category, setCategory] = useState('overall'); // overall, quantitative, logical, verbal, technical

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

  // Calculate score based on time range
  const calculateScoreForTimeRange = (user, attempts, timeRange) => {
    if (!attempts || attempts.length === 0) return 0;
    
    const now = new Date();
    let startDate = new Date(0);
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0); // All time
    }
    
    // Filter attempts based on time range
    const filteredAttempts = attempts.filter(attempt => {
      const attemptDate = attempt.completedAt?.toDate ? attempt.completedAt.toDate() : new Date(attempt.completedAt);
      return attemptDate >= startDate && attempt.status === 'completed';
    });
    
    if (filteredAttempts.length === 0) return 0;
    
    // Calculate weighted average score
    const totalScore = filteredAttempts.reduce((sum, attempt) => {
      // Weight more recent attempts higher
      const attemptDate = attempt.completedAt?.toDate ? attempt.completedAt.toDate() : new Date(attempt.completedAt);
      const daysAgo = Math.floor((now - attemptDate) / (1000 * 60 * 60 * 24));
      const weight = Math.max(0.5, 1 - (daysAgo / 30)); // Decrease weight over time, minimum 0.5
      
      return sum + (attempt.percentage || 0) * weight;
    }, 0);
    
    return Math.round(totalScore / filteredAttempts.length);
  };

  // Calculate consistency score
  const calculateConsistencyScore = (attempts) => {
    if (!attempts || attempts.length < 2) return 100;
    
    const scores = attempts.map(a => a.percentage || 0);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation means higher consistency
    return Math.max(0, 100 - stdDev);
  };

  // Calculate activity score
  const calculateActivityScore = (attempts, timeRange) => {
    if (!attempts || attempts.length === 0) return 0;
    
    const now = new Date();
    let startDate = new Date(0);
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Last year
    }
    
    const filteredAttempts = attempts.filter(attempt => {
      const attemptDate = attempt.completedAt?.toDate ? attempt.completedAt.toDate() : new Date(attempt.completedAt);
      return attemptDate >= startDate && attempt.status === 'completed';
    });
    
    // Calculate tests per week
    const timeDiff = (now - startDate) / (1000 * 60 * 60 * 24 * 7); // Weeks
    const testsPerWeek = filteredAttempts.length / Math.max(1, timeDiff);
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.round(testsPerWeek * 20));
  };

  // Calculate composite ranking score
  const calculateRankingScore = (user, attempts, timeRange) => {
    const avgScore = calculateScoreForTimeRange(user, attempts, timeRange);
    const consistency = calculateConsistencyScore(attempts);
    const activity = calculateActivityScore(attempts, timeRange);
    
    // Weighted composite score
    // 60% average score, 25% consistency, 15% activity
    return Math.round(avgScore * 0.6 + consistency * 0.25 + activity * 0.15);
  };

  useEffect(() => {
    const setupUsersListener = () => {
      const unsubscribe = listenToLeaderboardUsers(async (users) => {
        try {
          // Fetch attempts for each user and calculate ranking scores
          const usersWithScores = await Promise.all(users.map(async (user) => {
            try {
              const attempts = await getAttemptsByUser(user.id, 50); // Get last 50 attempts
              const rankingScore = calculateRankingScore(user, attempts, timeRange);
              const avgScore = calculateScoreForTimeRange(user, attempts, timeRange);
              const consistency = calculateConsistencyScore(attempts);
              const activity = calculateActivityScore(attempts, timeRange);
              
              return {
                ...user,
                attempts,
                rankingScore,
                avgScore,
                consistency,
                activity
              };
            } catch (error) {
              console.error(`Error fetching attempts for user ${user.id}:`, error);
              return {
                ...user,
                attempts: [],
                rankingScore: 0,
                avgScore: 0,
                consistency: 0,
                activity: 0
              };
            }
          }));
          
          // Sort by ranking score descending
          const sortedUsers = usersWithScores.sort((a, b) => 
            b.rankingScore - a.rankingScore
          );
          
          // Add rank to each user
          const rankedUsers = sortedUsers.map((user, index) => ({
            ...user,
            rank: index + 1
          }));
          
          setLeaderboardData(rankedUsers);
          setLoading(false);
        } catch (error) {
          console.error('Error processing leaderboard data:', error);
          setLoading(false);
        }
      });
      
      return () => unsubscribe();
    };
    
    const unsubscribe = setupUsersListener();
    return () => unsubscribe();
  }, [timeRange, category]);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getUserRank = () => {
    if (!currentUser) return null;
    return leaderboardData.find(user => user.id === currentUser.id)?.rank || null;
  };

  const getUserRankingScore = () => {
    if (!currentUser) return null;
    return leaderboardData.find(user => user.id === currentUser.id)?.rankingScore || 0;
  };

  const getUserAvgScore = () => {
    if (!currentUser) return null;
    return leaderboardData.find(user => user.id === currentUser.id)?.avgScore || 0;
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Add Student Navigation Sidebar */}
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
      
      {/* Main Content Area with margin to accommodate sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex justify-between items-center mb-4">
                {/* Removed Back to Dashboard button */}
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto">
                    <Trophy size={32} color="white" />
                  </div>
                </div>
                <div className="w-32"></div> {/* Spacer for alignment */}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how you rank against other students on the platform. Compete for the top spots!
              </p>
            </div>

            {/* User's Rank Card */}
            {currentUser && (
              <div className="glass-card rounded-2xl p-6 mb-8 text-center">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {getUserRank() || '-'}
                      </span>
                    </div>
                    {getUserRank() && getUserRank() <= 3 && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Trophy size={16} color="white" />
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {currentUser.name || currentUser.displayName || 'Student'}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                      <div>
                        <p className="text-muted-foreground text-sm">Your Rank</p>
                        <p className="text-foreground font-bold text-xl">#{getUserRank() || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Ranking Score</p>
                        <p className="text-foreground font-bold text-xl">{getUserRankingScore() || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Avg Score</p>
                        <p className="text-foreground font-bold text-xl">{Math.round(getUserAvgScore() || 0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="glass-card rounded-2xl p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Time Range</label>
                  <div className="flex gap-2">
                    <Button
                      variant={timeRange === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('all')}
                    >
                      All Time
                    </Button>
                    <Button
                      variant={timeRange === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('week')}
                    >
                      This Week
                    </Button>
                    <Button
                      variant={timeRange === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange('month')}
                    >
                      This Month
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Category</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={category === 'overall' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategory('overall')}
                    >
                      Overall
                    </Button>
                    <Button
                      variant={category === 'quantitative' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategory('quantitative')}
                    >
                      Quantitative
                    </Button>
                    <Button
                      variant={category === 'logical' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategory('logical')}
                    >
                      Logical Reasoning
                    </Button>
                    <Button
                      variant={category === 'verbal' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategory('verbal')}
                    >
                      Verbal Ability
                    </Button>
                    <Button
                      variant={category === 'technical' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategory('technical')}
                    >
                      Technical
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No leaderboard data available</h3>
                  <p className="text-muted-foreground">
                    Complete tests to appear on the leaderboard
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium">Rank</th>
                        <th className="text-left py-4 px-6 font-medium">Student</th>
                        <th className="text-left py-4 px-6 font-medium">Tests</th>
                        <th className="text-left py-4 px-6 font-medium">Avg Score</th>
                        <th className="text-left py-4 px-6 font-medium">Ranking Score</th>
                        <th className="text-left py-4 px-6 font-medium">Consistency</th>
                        <th className="text-left py-4 px-6 font-medium">Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className={`border-b border-border hover:bg-muted/50 ${
                            user.id === currentUser?.id ? 'bg-primary/10' : ''
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              {index < 3 ? (
                                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                                  <span className="text-white font-bold text-sm">
                                    {index + 1}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                                  <span className="text-foreground font-medium text-sm">
                                    {index + 1}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <span className="text-primary font-bold">
                                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{user.name || user.email?.split('@')[0] || 'Anonymous'}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium">{user.stats?.totalTestsTaken || 0}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold">
                              {Math.round(user.avgScore || 0)}%
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="font-bold text-lg mr-2">
                                {user.rankingScore || 0}
                              </div>
                              {index < 3 && (
                                index === 0 ? <Trophy size={16} className="text-yellow-500" /> : index === 1 ? <Award size={16} className="text-gray-400" /> : <Target size={16} className="text-amber-700" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-full bg-muted rounded-full h-2 mr-2">
                                <div 
                                  className="bg-success h-2 rounded-full" 
                                  style={{ width: `${Math.min(100, user.consistency || 0)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{Math.round(user.consistency || 0)}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-full bg-muted rounded-full h-2 mr-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${Math.min(100, user.activity || 0)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{Math.round(user.activity || 0)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-8 glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">How Ranking Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Average Score (60%)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your average test score with recent tests weighted higher.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Consistency (25%)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      How consistent your performance is across different tests.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Activity (15%)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      How regularly you take tests and participate in the platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Time Weighting</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recent performance has more impact on your ranking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;