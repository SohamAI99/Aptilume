import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import * as authService from '../../../utils/authService';
import aiService from '../../../utils/aiService';
import AccountSection from '../../../components/ui/AccountSection';

const AIAssistance = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quiz-generator');
  const [quizParams, setQuizParams] = useState({
    topic: '',
    difficulty: 'medium',
    count: 10
  });
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      navigate('/authentication-login-register');
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizParams.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const result = await aiService.generateQuiz({
        topic: quizParams.topic,
        difficulty: quizParams.difficulty,
        count: parseInt(quizParams.count)
      });
      
      setGeneratedQuiz(result);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleParamChange = (field, value) => {
    setQuizParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
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
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Assistance</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'quiz-generator'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('quiz-generator')}
              >
                Quiz Generator
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'concept-explainer'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('concept-explainer')}
              >
                Concept Explainer
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {activeTab === 'quiz-generator' && (
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">AI Quiz Generator</h2>
                  <p className="text-muted-foreground mb-6">
                    Generate custom quizzes based on topics, difficulty, and question count.
                  </p>
                  
                  <form onSubmit={handleGenerateQuiz} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Topic</label>
                      <input
                        type="text"
                        value={quizParams.topic}
                        onChange={(e) => handleParamChange('topic', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter topic (e.g., JavaScript, Data Structures, Aptitude)"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                        <select
                          value={quizParams.difficulty}
                          onChange={(e) => handleParamChange('difficulty', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Number of Questions</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={quizParams.count}
                          onChange={(e) => handleParamChange('count', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="text-error text-sm">{error}</div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isGenerating}
                        iconName={isGenerating ? "Loader2" : "Sparkles"}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Quiz'}
                      </Button>
                    </div>
                  </form>
                </div>
                
                {generatedQuiz && (
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">Generated Quiz</h3>
                      <Button variant="outline" iconName="Download">
                        Export Quiz
                      </Button>
                    </div>
                    
                    <div className="mb-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">{generatedQuiz.questions[0]?.topic || 'Custom Quiz'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {generatedQuiz.questions.length} questions • {generatedQuiz.questions[0]?.difficulty || 'Medium'} difficulty
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {generatedQuiz.questions.map((question, index) => (
                        <div key={question.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-start">
                            <span className="font-medium mr-2">Q{index + 1}.</span>
                            <div>
                              <p className="mb-2">{question.question}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex} 
                                    className={`p-2 rounded border ${
                                      optIndex === question.correctAnswer 
                                        ? 'border-success bg-success/10' 
                                        : 'border-border'
                                    }`}
                                  >
                                    <span className="font-medium mr-2">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    {option}
                                    {optIndex === question.correctAnswer && (
                                      <span className="ml-2 text-success text-xs">Correct</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <span className="font-medium">Explanation:</span> {question.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button variant="outline" iconName="Plus">
                        Add to My Quizzes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'concept-explainer' && (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">AI Concept Explainer</h2>
                <p className="text-muted-foreground mb-6">
                  Get detailed explanations of concepts with examples and resources.
                </p>
                
                <div className="text-center py-12">
                  <Icon name="Sparkles" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Concept Explainer Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Get AI-powered explanations for complex topics and concepts.
                  </p>
                  <Button variant="outline" disabled>
                    Explain Concept
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAssistance;