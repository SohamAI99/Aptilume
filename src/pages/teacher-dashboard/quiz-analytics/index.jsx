import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';
import * as authService from '../../../utils/authService';
import { listenToQuiz, listenToResultsByQuiz, getQuizPerformance } from '../../../utils/dbService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ProfileDropdown from '../../../components/ui/ProfileDropdown';

const QuizAnalytics = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);

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

  // Listen to quiz data and results
  useEffect(() => {
    if (!quizId) return;

    // Listen to quiz data
    const unsubscribeQuiz = listenToQuiz(quizId, (quizData) => {
      setQuiz(quizData);
    });

    // Listen to results for this quiz
    const unsubscribeResults = listenToResultsByQuiz(quizId, (resultsData) => {
      setResults(resultsData);
    });

    // Fetch performance data
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const perfData = await getQuizPerformance(quizId);
        setPerformanceData(perfData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setLoading(false);
      }
    };

    fetchPerformanceData();

    return () => {
      unsubscribeQuiz();
      unsubscribeResults();
    };
  }, [quizId]);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading quiz analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested quiz could not be found.</p>
            <Button onClick={() => navigate('/teacher-dashboard/my-quizzes')}>
              Back to My Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mock user data for navigation
  const mockUser = {
    name: 'Teacher',
    userType: 'teacher'
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Profile Dropdown */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
            </div>
            <ProfileDropdown currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Quiz Analytics</h1>
                  <p className="text-muted-foreground mt-1">
                    Detailed performance analytics for "{quiz.title}"
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/teacher-dashboard/my-quizzes')}
                  iconName="ArrowLeft"
                >
                  Back to Quizzes
                </Button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Icon name="Users" size={20} className="text-primary" />
                  </div>
                  <h3 className="font-medium">Total Attempts</h3>
                </div>
                <div className="text-3xl font-bold">{performanceData?.totalAttempts || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {performanceData?.completedAttempts || 0} completed
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-success/10 p-2 rounded-lg">
                    <Icon name="CheckCircle" size={20} className="text-success" />
                  </div>
                  <h3 className="font-medium">Completion Rate</h3>
                </div>
                <div className="text-3xl font-bold">{performanceData?.completionRate || 0}%</div>
                <div className="text-sm text-muted-foreground mt-1">Of all attempts</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Icon name="BarChart3" size={20} className="text-accent" />
                  </div>
                  <h3 className="font-medium">Avg. Score</h3>
                </div>
                <div className="text-3xl font-bold">{performanceData?.avgScore || 0}%</div>
                <div className="text-sm text-muted-foreground mt-1">Across all attempts</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-warning/10 p-2 rounded-lg">
                    <Icon name="Award" size={20} className="text-warning" />
                  </div>
                  <h3 className="font-medium">Score Range</h3>
                </div>
                <div className="text-3xl font-bold">
                  {performanceData?.lowestScore || 0} - {performanceData?.highestScore || 0}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Lowest to highest</div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Score Distribution</h2>
                <Button variant="outline" size="sm" iconName="Download">
                  Export Data
                </Button>
              </div>
              
              {results.length > 0 ? (
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {/* Group results by score ranges */}
                  {(() => {
                    const scoreRanges = [0, 20, 40, 60, 80, 100];
                    const rangeLabels = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
                    const rangeCounts = Array(5).fill(0);
                    
                    results.forEach(result => {
                      const score = result.score;
                      for (let i = 0; i < scoreRanges.length - 1; i++) {
                        if (score >= scoreRanges[i] && score <= scoreRanges[i + 1]) {
                          rangeCounts[i]++;
                          break;
                        }
                      }
                    });
                    
                    const maxCount = Math.max(...rangeCounts);
                    
                    return rangeLabels.map((label, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="text-xs text-muted-foreground mb-2">{label}</div>
                        <div 
                          className="w-full bg-primary rounded-t-lg transition-all duration-500 ease-out"
                          style={{ 
                            height: maxCount > 0 ? `${(rangeCounts[index] / maxCount) * 90}%` : '0%' 
                          }}
                        ></div>
                        <div className="text-sm font-medium mt-2">{rangeCounts[index]}</div>
                      </div>
                    ));
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No attempt data available for this quiz
                </div>
              )}
            </div>

            {/* Top Performers */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Top Performers</h2>
                <Button variant="outline" size="sm" iconName="Download">
                  Export List
                </Button>
              </div>
              
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Student</th>
                        <th className="text-left py-3 px-4 font-medium">Score</th>
                        <th className="text-left py-3 px-4 font-medium">Time Taken</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...results]
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 10)
                        .map((result, index) => (
                          <tr key={index} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">
                              {result.studentName || result.studentEmail || 'Anonymous User'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-medium ${
                                result.score >= 80 ? 'text-success' : 
                                result.score >= 60 ? 'text-warning' : 'text-error'
                              }`}>
                                {result.score}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {result.timeTaken ? `${Math.round(result.timeTaken / 60)} min` : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              {result.completedAt?.toDate().toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" iconName="Eye">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No results available for this quiz
                </div>
              )}
            </div>

            {/* Question Analysis */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Question Analysis</h2>
                <Button variant="outline" size="sm" iconName="Download">
                  Export Analysis
                </Button>
              </div>
              
              <div className="text-center py-8 text-muted-foreground">
                Detailed question analysis will be available in a future update
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizAnalytics;