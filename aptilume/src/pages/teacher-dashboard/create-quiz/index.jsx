import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import AIQuizGenerator from '../../../components/ai/AIQuizGenerator';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual'); // manual, ai
  const [isAIQuizGeneratorOpen, setIsAIQuizGeneratorOpen] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    duration: 30,
    questionCount: 10,
    topics: [],
    isPublished: false
  });
  const [newTopic, setNewTopic] = useState('');

  const handleInputChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !quizData.topics.includes(newTopic.trim())) {
      setQuizData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setQuizData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }));
  };

  const handleCreateQuiz = () => {
    // In a real app, this would call an API to create the quiz
    console.log('Creating quiz:', quizData);
    // Navigate to the quiz editor page (would need to be created)
    navigate('/teacher/quizzes');
  };

  const handleQuizGenerated = (quizId, quiz) => {
    console.log('AI Quiz generated:', quizId, quiz);
    setIsAIQuizGeneratorOpen(false);
    // In a real app, this would save the quiz to the database
    // Navigate to the newly created quiz
    navigate('/teacher/quizzes');
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
                <p className="text-muted-foreground mt-1">
                  Create a new quiz manually or use AI to generate questions
                </p>
              </div>
            </div>

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
                    <label className="block text-sm font-medium mb-2">Quiz Title</label>
                    <Input
                      value={quizData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., JavaScript Fundamentals"
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select
                      value={quizData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      options={[
                        { value: 'easy', label: 'Easy' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'hard', label: 'Hard' }
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
                  <label className="block text-sm font-medium mb-2">Topics</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="Add a topic"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTopic();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleAddTopic} iconName="Plus">
                      Add
                    </Button>
                  </div>
                  {quizData.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {quizData.topics.map((topic, index) => (
                        <div key={index} className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                          <span className="text-sm">{topic}</span>
                          <button
                            onClick={() => handleRemoveTopic(topic)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
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
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateQuiz}
                      disabled={!quizData.title.trim()}
                      iconName="PlusCircle"
                    >
                      Create Quiz
                    </Button>
                  </div>
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
  );
};

export default CreateQuiz;