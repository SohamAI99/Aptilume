import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import AIQuizGenerator from '../../../components/ai/AIQuizGenerator';
import * as authService from '../../../utils/authService';
import { createQuiz } from '../../../utils/dbService';
import AccountSection from '../../../components/ui/AccountSection';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual'); // manual, ai
  const [isAIQuizGeneratorOpen, setIsAIQuizGeneratorOpen] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    duration: 30,
    questionCount: 10,
    category: 'General',
    tags: [],
    isPublished: false,
    isRecommended: false
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !quizData.tags.includes(newTag.trim())) {
      setQuizData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setQuizData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!quizData.title.trim()) {
        throw new Error('Quiz title is required');
      }
      
      if (quizData.duration < 1 || quizData.duration > 180) {
        throw new Error('Duration must be between 1 and 180 minutes');
      }
      
      if (quizData.questionCount < 1 || quizData.questionCount > 100) {
        throw new Error('Question count must be between 1 and 100');
      }

      // Get current user
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare quiz data for Firestore
      const quizPayload = {
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty,
        duration: parseInt(quizData.duration),
        questionCount: parseInt(quizData.questionCount),
        category: quizData.category,
        tags: quizData.tags,
        isPublished: quizData.isPublished,
        isRecommended: quizData.isRecommended,
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0
        }
      };

      // Create quiz in Firestore
      const quizId = await createQuiz(quizPayload);
      
      // Navigate to the quiz editor page
      navigate(`/teacher/quiz/${quizId}/edit`);
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(err.message || 'Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizGenerated = async (quizId, quiz) => {
    try {
      setIsAIQuizGeneratorOpen(false);
      // Navigate to the quiz editor page
      navigate(`/teacher/quiz/${quizId}/edit`);
    } catch (err) {
      console.error('Error handling AI generated quiz:', err);
      setError(err.message || 'Failed to process AI generated quiz. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Quiz</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
          <div className="max-w-full mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
                <p className="text-muted-foreground mt-1">
                  Create a new quiz manually or use AI to generate questions
                </p>
              </div>
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

            {/* Tab Navigation */}
            <div className="border-b border-border mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'manual'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Manual Creation
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'ai'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="Sparkles" size={16} />
                    AI Generation
                  </div>
                </button>
              </nav>
            </div>

            {activeTab === 'manual' ? (
              <div className="glass-card rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quiz Title *</label>
                    <Input
                      value={quizData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Quantitative Aptitude Mastery"
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                      value={quizData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      options={[
                        { value: 'General', label: 'General' },
                        { value: 'Quantitative Aptitude', label: 'Quantitative Aptitude' },
                        { value: 'Logical Reasoning', label: 'Logical Reasoning' },
                        { value: 'Verbal Ability', label: 'Verbal Ability' },
                        { value: 'Data Interpretation', label: 'Data Interpretation' },
                        { value: 'Technical Interview', label: 'Technical Interview' },
                        { value: 'Software Engineering', label: 'Software Engineering' },
                        { value: 'Product Management', label: 'Product Management' }
                      ]}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select
                      value={quizData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      options={[
                        { value: 'Easy', label: 'Easy' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'Hard', label: 'Hard' }
                      ]}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={quizData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      min="1"
                      max="180"
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Count</label>
                    <Input
                      type="number"
                      value={quizData.questionCount}
                      onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value))}
                      min="1"
                      max="100"
                      fullWidth
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={quizData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what this quiz covers..."
                    className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleAddTag} iconName="Plus">
                      Add
                    </Button>
                  </div>
                  {quizData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {quizData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                          <span className="text-sm">{tag}</span>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="publish"
                        checked={quizData.isPublished}
                        onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="publish" className="ml-2 text-sm">
                        Publish immediately
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recommend"
                        checked={quizData.isRecommended}
                        onChange={(e) => handleInputChange('isRecommended', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="recommend" className="ml-2 text-sm">
                        Recommend to students
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateQuiz}
                    disabled={!quizData.title.trim() || loading}
                    iconName="PlusCircle"
                  >
                    {loading ? 'Creating...' : 'Create Quiz'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon name="Sparkles" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Quiz Generator</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Use our AI to automatically generate a quiz based on a topic, difficulty level, and number of questions.
                  </p>
                  <Button onClick={() => setIsAIQuizGeneratorOpen(true)} iconName="Sparkles">
                    Generate Quiz with AI
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {isAIQuizGeneratorOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AIQuizGenerator
            onQuizGenerated={handleQuizGenerated}
            onCancel={() => setIsAIQuizGeneratorOpen(false)}
          />
        </div>
      )}
    </div>
  </div>
  );
};

export default CreateQuiz;