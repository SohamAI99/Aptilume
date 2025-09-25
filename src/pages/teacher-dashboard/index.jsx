import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from './components/TeacherNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AIQuizGenerator from '../../components/ai/AIQuizGenerator';
import { listenToUser, listenToQuizzes, getResultsByUser } from '../../utils/dbService';
import * as authService from '../../utils/authService';
import AccountSection from '../../components/ui/AccountSection';
import { getQuizzes, getQuizPerformance } from '../../utils/dbService';
import { runAddQuestionsScript } from '../../utils/addSampleQuestions';
import { createTestQuiz } from '../../utils/createTestQuiz';
import { createOrUpdateMicrosoftQuiz } from '../../utils/createMicrosoftQuiz';
import { createOrUpdateMetaQuiz } from '../../utils/createMetaQuiz'; // Add this import

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, analytics, ai-assistance
  const [showAIQuizGenerator, setShowAIQuizGenerator] = useState(false);

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
        
        // Listen to quizzes created by this teacher
        quizzesUnsubscribe = listenToQuizzes((quizData) => {
          setQuizzes(quizData);
          setLoading(false);
        }, { createdBy: user?.uid });
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
    name: currentUser?.name || currentUser?.displayName || "Teacher",
    email: currentUser?.email || "",
    avatar: currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    userType: currentUser?.userType || "teacher"
  };

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      navigate('/authentication-login-register');
    }
  };

  const handleCreateQuiz = () => {
    // Navigate to quiz creation page
    navigate('/teacher/create-quiz');
  };

  const handleViewResults = (quizId) => {
    // Navigate to quiz results page
    navigate(`/teacher/quiz/${quizId}/results`);
  };

  const handleEditQuiz = (quizId) => {
    // Navigate to quiz edit page
    navigate(`/teacher/quiz/${quizId}/edit`);
  };

  const handleAddSampleQuestions = async () => {
    try {
      setLoading(true);
      await runAddQuestionsScript();
      // Refresh quizzes after adding questions
      const quizzesData = await getQuizzes();
      setQuizzes(quizzesData);
      alert('Sample questions added successfully!');
    } catch (error) {
      console.error('Error adding sample questions:', error);
      alert('Failed to add sample questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestQuiz = async () => {
    try {
      setLoading(true);
      const quizId = await createTestQuiz();
      // Refresh quizzes after creating test quiz
      const quizzesData = await getQuizzes();
      setQuizzes(quizzesData);
      alert(`Test quiz created successfully with ID: ${quizId}`);
    } catch (error) {
      console.error('Error creating test quiz:', error);
      alert('Failed to create test quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMicrosoftQuiz = async () => {
    try {
      setLoading(true);
      const quizId = await createOrUpdateMicrosoftQuiz();
      // Refresh quizzes after creating Microsoft quiz
      const quizzesData = await getQuizzes();
      setQuizzes(quizzesData);
      alert(`Microsoft Technical Interview Prep quiz created/updated successfully with ID: ${quizId}`);
    } catch (error) {
      console.error('Error creating Microsoft quiz:', error);
      alert('Failed to create/update Microsoft quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMetaQuiz = async () => {
    try {
      setLoading(true);
      const quizId = await createOrUpdateMetaQuiz();
      // Refresh quizzes after creating Meta quiz
      const quizzesData = await getQuizzes();
      setQuizzes(quizzesData);
      alert(`Meta Product Sense Assessment quiz created/updated successfully with ID: ${quizId}`);
    } catch (error) {
      console.error('Error creating Meta quiz:', error);
      alert('Failed to create/update Meta quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedTwoQuizzes = async () => {
    try {
      setLoading(true);
      const microsoftQuizId = await createOrUpdateMicrosoftQuiz();
      const metaQuizId = await createOrUpdateMetaQuiz();
      // Refresh quizzes after creating both quizzes
      const quizzesData = await getQuizzes();
      setQuizzes(quizzesData);
      alert(`Both quizzes created/updated successfully!\nMicrosoft Quiz ID: ${microsoftQuizId}\nMeta Quiz ID: ${metaQuizId}`);
    } catch (error) {
      console.error('Error seeding two quizzes:', error);
      alert('Failed to seed two quizzes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your quizzes and track student performance
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Add these buttons */}
                  <Button 
                    variant="secondary" 
                    onClick={handleAddSampleQuestions}
                    disabled={loading}
                    iconName="PlusCircle"
                  >
                    {loading ? 'Adding...' : 'Add Sample Questions'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCreateTestQuiz}
                    disabled={loading}
                    iconName="TestTube"
                  >
                    {loading ? 'Creating...' : 'Create Test Quiz'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCreateMicrosoftQuiz}
                    disabled={loading}
                    iconName="Microsoft"
                  >
                    {loading ? 'Creating...' : 'Microsoft Quiz'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleCreateMetaQuiz}
                    disabled={loading}
                    iconName="Meta"
                  >
                    {loading ? 'Creating...' : 'Meta Quiz'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleSeedTwoQuizzes}
                    disabled={loading}
                    iconName="Database"
                  >
                    {loading ? 'Seeding...' : 'Seed Two Quizzes'}
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleCreateQuiz}
                    iconName="Plus"
                  >
                    Create New Quiz
                  </Button>
                </div>
              </div>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Welcome back, {mockUser?.name}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Manage your quizzes and track student progress
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateQuiz} iconName="Plus">
                      Create Quiz
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAIQuizGenerator(true)}
                      iconName="Sparkles"
                    >
                      AI Quiz Generator
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Quiz Generator Modal */}
              {showAIQuizGenerator && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <AIQuizGenerator 
                    onQuizGenerated={() => setShowAIQuizGenerator(false)}
                    onCancel={() => setShowAIQuizGenerator(false)}
                  />
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card rounded-xl p-5">
                  <div className="text-2xl font-bold">{quizzes.length}</div>
                  <div className="text-muted-foreground text-sm mt-1">Total Quizzes</div>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <div className="text-2xl font-bold">124</div>
                  <div className="text-muted-foreground text-sm mt-1">Total Attempts</div>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-muted-foreground text-sm mt-1">Avg. Score</div>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-muted-foreground text-sm mt-1">Active Students</div>
                </div>
              </div>

              {/* Quizzes Section */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Your Quizzes</h2>
                  <Button variant="outline" onClick={handleCreateQuiz} iconName="Plus" size="sm">
                    New Quiz
                  </Button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No quizzes created yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by creating your first quiz
                    </p>
                    <Button onClick={handleCreateQuiz} iconName="Plus">
                      Create Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">Quiz Title</th>
                          <th className="text-left py-3 px-4 font-medium">Questions</th>
                          <th className="text-left py-3 px-4 font-medium">Difficulty</th>
                          <th className="text-left py-3 px-4 font-medium">Attempts</th>
                          <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizzes.map((quiz) => (
                          <tr key={quiz.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{quiz.title}</div>
                              <div className="text-sm text-muted-foreground">{quiz.description}</div>
                            </td>
                            <td className="py-3 px-4">{quiz.questionCount || 0}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                quiz.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                                quiz.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                                quiz.difficulty === 'Hard' ? 'bg-error/20 text-error' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {quiz.difficulty}
                              </span>
                            </td>
                            <td className="py-3 px-4">{quiz.stats?.totalAttempts || 0}</td>
                            <td className="py-3 px-4">{quiz.stats?.averageScore || 0}%</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditQuiz(quiz.id)}
                                  iconName="Edit3"
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewResults(quiz.id)}
                                  iconName="BarChart3"
                                >
                                  Results
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;