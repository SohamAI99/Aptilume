import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import * as authService from '../../../utils/authService';
import { listenToQuizzes, updateQuiz, publishQuiz, archiveQuiz } from '../../../utils/dbService';
import AccountSection from '../../../components/ui/AccountSection';

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    let unsubscribe;
    
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user
        const user = await authService.getCurrentUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Listen to quizzes created by this teacher
        unsubscribe = listenToQuizzes((quizData) => {
          setQuizzes(quizData);
          setLoading(false);
        }, { createdBy: user.uid });
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError(err.message || 'Failed to load quizzes. Please try again.');
        setLoading(false);
      }
    };

    fetchQuizzes();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreateQuiz = () => {
    navigate('/teacher/create-quiz');
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/teacher/quiz/${quizId}/edit`);
  };

  const handleViewAnalytics = (quizId) => {
    navigate(`/teacher/quiz/${quizId}/analytics`);
  };

  const handleTogglePublish = async (quizId) => {
    try {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return;
      
      if (quiz.isPublished) {
        // Unpublish the quiz
        await archiveQuiz(quizId);
      } else {
        // Publish the quiz
        await publishQuiz(quizId);
      }
      
      // Update local state
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === quizId 
          ? { ...quiz, isPublished: !quiz.isPublished, updatedAt: new Date() } 
          : quiz
      ));
    } catch (err) {
      console.error('Error toggling quiz publish status:', err);
      setError(err.message || 'Failed to update quiz status. Please try again.');
    }
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Quizzes</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
          <div className="max-w-full mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Quizzes</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your created quizzes and view performance statistics
                </p>
              </div>
              <Button onClick={handleCreateQuiz} iconName="Plus">
                Create Quiz
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-card rounded-2xl p-4 mb-6 bg-error/10 border border-error">
                <div className="flex items-center text-error">
                  <Icon name="AlertCircle" size={18} className="mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quizzes by title or description..."
                  className="w-full glass-card border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Quizzes List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'Try adjusting your search query' : 'Get started by creating your first quiz'}
                </p>
                <Button onClick={handleCreateQuiz} iconName="Plus">
                  Create Quiz
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.isPublished 
                          ? 'bg-success/20 text-success' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {quiz.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        quiz.difficulty === 'easy' ? 'bg-success/20 text-success' :
                        quiz.difficulty === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-error/20 text-error'
                      }`}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-muted text-foreground">
                        {quiz.questionCount || 0} questions
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-muted text-foreground">
                        {quiz.duration || 0} min
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">{quiz.stats?.totalAttempts || 0}</div>
                        <div className="text-xs text-muted-foreground">Attempts</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{quiz.stats?.averageScore ? Math.round(quiz.stats.averageScore) : 0}%</div>
                        <div className="text-xs text-muted-foreground">Avg. Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{quiz.stats?.highestScore || 0}%</div>
                        <div className="text-xs text-muted-foreground">Highest</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditQuiz(quiz.id)}
                        iconName="Edit3"
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewAnalytics(quiz.id)}
                        iconName="BarChart3"
                        className="flex-1"
                      >
                        Analytics
                      </Button>
                      <Button 
                        variant={quiz.isPublished ? "outline" : "default"}
                        size="sm" 
                        onClick={() => handleTogglePublish(quiz.id)}
                        iconName={quiz.isPublished ? "EyeOff" : "Eye"}
                      >
                        {quiz.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
  );
};

export default MyQuizzes;