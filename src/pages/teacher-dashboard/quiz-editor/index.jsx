import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import * as authService from '../../../utils/authService';
import { getQuiz, updateQuiz, getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../../../utils/dbService';

const QuizEditor = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // details, questions
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Medium',
    category: 'General',
    topic: '',
    marks: 4
  });

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setLoading(true);
        const quiz = await getQuiz(quizId);
        const questionsData = await getQuestions(quizId);
        
        setQuizData(quiz);
        setQuestions(questionsData);
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError('Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      loadQuizData();
    }
  }, [quizId]);

  const handleQuizUpdate = async (field, value) => {
    try {
      setSaving(true);
      const updatedQuiz = { ...quizData, [field]: value };
      await updateQuiz(quizId, { [field]: value });
      setQuizData(updatedQuiz);
    } catch (err) {
      console.error('Error updating quiz:', err);
      setError('Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    try {
      // Validate question data
      if (!newQuestion.text.trim()) {
        setError('Question text is required');
        return;
      }
      
      if (newQuestion.options.some(option => !option.trim())) {
        setError('All options are required');
        return;
      }
      
      const questionData = {
        ...newQuestion,
        createdAt: new Date()
      };
      
      const questionId = await addQuestion(quizId, questionData);
      
      // Add to local state
      setQuestions(prev => [...prev, { id: questionId, ...questionData }]);
      
      // Reset form
      setNewQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'Medium',
        category: 'General',
        topic: '',
        marks: 4
      });
      
      setError(null);
    } catch (err) {
      console.error('Error adding question:', err);
      setError('Failed to add question');
    }
  };

  const handleUpdateQuestion = async (questionId, field, value) => {
    try {
      setSaving(true);
      await updateQuestion(quizId, questionId, { [field]: value });
      
      // Update local state
      setQuestions(prev => 
        prev.map(q => 
          q.id === questionId ? { ...q, [field]: value } : q
        )
      );
    } catch (err) {
      console.error('Error updating question:', err);
      setError('Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      if (window.confirm('Are you sure you want to delete this question?')) {
        await deleteQuestion(quizId, questionId);
        
        // Remove from local state
        setQuestions(prev => prev.filter(q => q.id !== questionId));
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question');
    }
  };

  const handleSaveQuiz = async () => {
    try {
      setSaving(true);
      // Update quiz with question count
      await updateQuiz(quizId, { 
        questionCount: questions.length,
        updatedAt: new Date()
      });
      
      // Show success message
      alert('Quiz saved successfully!');
      navigate('/teacher/quizzes');
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center glass-card rounded-2xl p-6 max-w-md">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/teacher/quizzes')}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Quiz Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested quiz could not be found.</p>
          <Button onClick={() => navigate('/teacher/quizzes')}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  // Mock user data for navigation
  const mockUser = {
    name: 'Teacher',
    userType: 'teacher'
  };

  const handleLogout = () => {
    navigate('/authentication-login-register');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Edit Quiz</h1>
                <p className="text-muted-foreground mt-1">
                  {quizData.title}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveQuiz}
                  disabled={saving}
                  iconName="Save"
                >
                  {saving ? 'Saving...' : 'Save Quiz'}
                </Button>
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
                  onClick={() => setActiveTab('details')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Quiz Details
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'questions'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Questions ({questions.length})
                </button>
              </nav>
            </div>

            {activeTab === 'details' ? (
              <div className="glass-card rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quiz Title</label>
                    <Input
                      value={quizData.title || ''}
                      onChange={(e) => handleQuizUpdate('title', e.target.value)}
                      placeholder="Quiz title"
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                      value={quizData.category || 'General'}
                      onChange={(e) => handleQuizUpdate('category', e.target.value)}
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
                      value={quizData.difficulty || 'Medium'}
                      onChange={(e) => handleQuizUpdate('difficulty', e.target.value)}
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
                      value={quizData.duration || 30}
                      onChange={(e) => handleQuizUpdate('duration', parseInt(e.target.value))}
                      min="1"
                      max="180"
                      fullWidth
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={quizData.description || ''}
                    onChange={(e) => handleQuizUpdate('description', e.target.value)}
                    placeholder="Quiz description"
                    className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="publish"
                        checked={quizData.isPublished || false}
                        onChange={(e) => handleQuizUpdate('isPublished', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="publish" className="ml-2 text-sm">
                        Published
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recommend"
                        checked={quizData.isRecommended || false}
                        onChange={(e) => handleQuizUpdate('isRecommended', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="recommend" className="ml-2 text-sm">
                        Recommended
                      </label>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Questions: {questions.length}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Add New Question Form */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Add New Question</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Question Text</label>
                      <textarea
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="Enter question text"
                        className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Options</label>
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="flex items-center">
                            <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span>
                            <Input
                              value={newQuestion.options[index]}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index] = e.target.value;
                                setNewQuestion(prev => ({ ...prev, options: newOptions }));
                              }}
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              className="flex-1"
                            />
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={newQuestion.correctAnswer === index}
                              onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: index }))}
                              className="ml-3"
                            />
                            <span className="ml-1 text-sm">Correct</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                        <Select
                          value={newQuestion.difficulty}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
                          options={[
                            { value: 'Easy', label: 'Easy' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'Hard', label: 'Hard' }
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Marks</label>
                        <Input
                          type="number"
                          value={newQuestion.marks}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Explanation</label>
                      <textarea
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                        placeholder="Explanation for the correct answer"
                        className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleAddQuestion} iconName="Plus">
                        Add Question
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Questions List */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Questions ({questions.length})</h2>
                  {questions.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No questions added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div key={question.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-medium">Question {index + 1}</div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteQuestion(question.id)}
                                iconName="Trash2"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <textarea
                              value={question.text || ''}
                              onChange={(e) => handleUpdateQuestion(question.id, 'text', e.target.value)}
                              className="w-full glass-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px]"
                            />
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">Options</div>
                            <div className="space-y-1">
                              {(question.options || ['', '', '', '']).map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center">
                                  <span className="mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || ['', '', '', ''])];
                                      newOptions[optIndex] = e.target.value;
                                      handleUpdateQuestion(question.id, 'options', newOptions);
                                    }}
                                    className="flex-1 text-sm"
                                  />
                                  <input
                                    type="radio"
                                    name={`correctAnswer-${question.id}`}
                                    checked={(question.correctAnswer || 0) === optIndex}
                                    onChange={() => handleUpdateQuestion(question.id, 'correctAnswer', optIndex)}
                                    className="ml-2"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Difficulty</label>
                              <Select
                                value={question.difficulty || 'Medium'}
                                onChange={(e) => handleUpdateQuestion(question.id, 'difficulty', e.target.value)}
                                options={[
                                  { value: 'Easy', label: 'Easy' },
                                  { value: 'Medium', label: 'Medium' },
                                  { value: 'Hard', label: 'Hard' }
                                ]}
                                size="sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Marks</label>
                              <Input
                                type="number"
                                value={question.marks || 4}
                                onChange={(e) => handleUpdateQuestion(question.id, 'marks', parseInt(e.target.value))}
                                min="1"
                                max="10"
                                size="sm"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-sm font-medium mb-1">Explanation</label>
                            <textarea
                              value={question.explanation || ''}
                              onChange={(e) => handleUpdateQuestion(question.id, 'explanation', e.target.value)}
                              className="w-full glass-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

export default QuizEditor;