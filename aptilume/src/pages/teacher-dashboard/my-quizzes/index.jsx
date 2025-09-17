import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for quizzes
  const mockQuizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Basic concepts of JavaScript programming",
      difficulty: "easy",
      questionCount: 20,
      duration: 30,
      isPublished: true,
      createdAt: "2025-09-10",
      stats: {
        totalAttempts: 42,
        averageScore: 78,
        highestScore: 95
      }
    },
    {
      id: 2,
      title: "React Components",
      description: "Understanding React components and lifecycle",
      difficulty: "medium",
      questionCount: 15,
      duration: 45,
      isPublished: true,
      createdAt: "2025-09-12",
      stats: {
        totalAttempts: 28,
        averageScore: 82,
        highestScore: 98
      }
    },
    {
      id: 3,
      title: "Advanced Algorithms",
      description: "Complex algorithmic problems and solutions",
      difficulty: "hard",
      questionCount: 10,
      duration: 60,
      isPublished: false,
      createdAt: "2025-09-15",
      stats: {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0
      }
    }
  ];

  useEffect(() => {
    // Simulate fetching quizzes from API
    setTimeout(() => {
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateQuiz = () => {
    navigate('/teacher/create-quiz');
  };

  const handleEditQuiz = (quizId) => {
    // Navigate to quiz editor (would need to be implemented)
    console.log('Edit quiz:', quizId);
  };

  const handleViewResults = (quizId) => {
    // Navigate to quiz results page (would need to be implemented)
    console.log('View results for quiz:', quizId);
  };

  const handleTogglePublish = (quizId) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId 
        ? { ...quiz, isPublished: !quiz.isPublished } 
        : quiz
    ));
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
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
                        {quiz.questionCount} questions
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-muted text-foreground">
                        {quiz.duration} min
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">{quiz.stats.totalAttempts}</div>
                        <div className="text-xs text-muted-foreground">Attempts</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{quiz.stats.averageScore}%</div>
                        <div className="text-xs text-muted-foreground">Avg. Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{quiz.stats.highestScore}%</div>
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
                        onClick={() => handleViewResults(quiz.id)}
                        iconName="BarChart3"
                        className="flex-1"
                      >
                        Results
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
  );
};

export default MyQuizzes;