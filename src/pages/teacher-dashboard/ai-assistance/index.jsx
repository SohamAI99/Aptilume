import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import TeacherNavigation from '../components/TeacherNavigation';
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

  const handleGenerateQuiz = async () => {
    if (!quizParams.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const quiz = await aiService.generateQuiz(quizParams);
      setGeneratedQuiz(quiz);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TeacherNavigation activeTab="ai-assistance" onTabChange={setActiveTab} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TeacherNavigation activeTab="ai-assistance" onTabChange={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">AI Assistance</h1>
                  <p className="text-muted-foreground">Generate quizzes and get AI-powered insights</p>
                </div>
              </div>

              {/* Quiz Generator Form */}
              <div className="bg-muted/30 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Quiz Generator</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={quizParams.topic}
                      onChange={(e) => setQuizParams({...quizParams, topic: e.target.value})}
                      placeholder="Enter topic (e.g., JavaScript, Python)"
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Difficulty
                    </label>
                    <select
                      value={quizParams.difficulty}
                      onChange={(e) => setQuizParams({...quizParams, difficulty: e.target.value})}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Question Count
                    </label>
                    <select
                      value={quizParams.count}
                      onChange={(e) => setQuizParams({...quizParams, count: parseInt(e.target.value)})}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {[5, 10, 15, 20].map(num => (
                        <option key={num} value={num}>{num} questions</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {error && (
                  <div className="text-destructive text-sm mb-4">{error}</div>
                )}
                
                <Button
                  variant="primary"
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="w-full md:w-auto"
                >
                  {isGenerating ? 'Generating...' : 'Generate Quiz'}
                </Button>
              </div>

              {/* Generated Quiz Preview */}
              {generatedQuiz && (
                <div className="bg-muted/30 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Generated Quiz Preview</h2>
                  <div className="space-y-4">
                    {generatedQuiz.questions.map((question, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <h3 className="font-medium text-foreground mb-2">
                          {index + 1}. {question.question}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2 p-2 bg-background rounded">
                              <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                              <span className="text-foreground">{option}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">Correct Answer:</span> {String.fromCharCode(65 + question.correctAnswer)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Section */}
          <div className="lg:w-80">
            <AccountSection user={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistance;