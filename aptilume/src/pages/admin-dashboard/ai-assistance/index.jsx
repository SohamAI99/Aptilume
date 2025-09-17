import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/ui/AppHeader';
import AdminNavigation from '../components/AdminNavigation';
import AdminAIAssistance from '../../../components/ai/AdminAIAssistance';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import * as authService from '../../../utils/authService';

const AdminAIAssistancePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleProfile = () => {
    // Navigate to profile page
    navigate('/profile');
  };

  const handleSettings = () => {
    // Navigate to settings page
    navigate('/settings');
  };

  const handleDashboard = () => {
    // Navigate to dashboard
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading AI assistance...</p>
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

  const [activeTab, setActiveTab] = useState('assistant');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) return;
    
    setIsGeneratingQuiz(true);
    
    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: quizTopic,
          difficulty: quizDifficulty,
          questionCount: questionCount
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedQuiz(data.data);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header with Profile */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">AI Assistance</h1>
                  <p className="text-muted-foreground mt-1">
                    Leverage artificial intelligence to enhance your quiz creation and management
                  </p>
                </div>
                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
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
            
            <div className="glass-card rounded-2xl overflow-hidden mb-8">
              <div className="border-b border-border">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'assistant'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name="Sparkles" size={16} className="inline mr-2" />
                    AI Assistant
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz-generator')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'quiz-generator'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name="FileText" size={16} className="inline mr-2" />
                    Quiz Generator
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {activeTab === 'assistant' ? (
                  <AdminAIAssistance />
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Quiz Topic
                        </label>
                        <input
                          type="text"
                          value={quizTopic}
                          onChange={(e) => setQuizTopic(e.target.value)}
                          placeholder="e.g., JavaScript Closures, React Hooks, etc."
                          className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Difficulty
                        </label>
                        <select
                          value={quizDifficulty}
                          onChange={(e) => setQuizDifficulty(e.target.value)}
                          className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Number of Questions
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="50"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                          className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleGenerateQuiz} 
                      disabled={!quizTopic.trim() || isGeneratingQuiz}
                      className="w-full md:w-auto"
                    >
                      {isGeneratingQuiz ? (
                        <>
                          <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Generating Quiz...
                        </> 
                      ) : (
                        <>
                          <Icon name="Zap" size={16} className="mr-2" />
                          Generate Quiz with AI
                        </>
                      )}
                    </Button>
                    
                    {generatedQuiz && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Generated Quiz: {generatedQuiz.title}</h3>
                        <p className="text-muted-foreground mb-4">{generatedQuiz.description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Difficulty:</span>
                            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                              {generatedQuiz.difficulty}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Questions:</span>
                            <span className="ml-2 font-medium">{generatedQuiz.questions.length}</span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Estimated Time:</span>
                            <span className="ml-2 font-medium">{generatedQuiz.estimatedTime} minutes</span>
                          </div>
                        </div>
                        <Button variant="default">
                          <Icon name="Edit3" size={16} className="mr-2" />
                          Review and Edit Quiz
                        </Button>
                      </div>
                    )}
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

export default AdminAIAssistancePage;