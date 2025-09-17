import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TestCard from '../components/TestCard';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Mock data for quizzes
  const mockQuizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Basic concepts of JavaScript programming",
      duration: "30 min",
      questionCount: 20,
      difficulty: "easy",
      companies: ["TechCorp"],
      attempts: 42,
      deadline: "2025-09-30",
      isNew: false,
      userProgress: {
        status: "completed",
        score: 85,
        lastAttempt: "2025-09-15"
      }
    },
    {
      id: 2,
      title: "React Components",
      description: "Understanding React components and lifecycle",
      duration: "45 min",
      questionCount: 15,
      difficulty: "medium",
      companies: ["WebSolutions"],
      attempts: 28,
      deadline: "2025-10-15",
      isNew: true,
      userProgress: {
        status: "in-progress",
        score: null,
        lastAttempt: "2025-09-16"
      }
    },
    {
      id: 3,
      title: "Advanced Algorithms",
      description: "Complex algorithmic problems and solutions",
      duration: "60 min",
      questionCount: 10,
      difficulty: "hard",
      companies: ["DataSystems"],
      attempts: 15,
      deadline: "2025-10-05",
      isNew: false,
      userProgress: {
        status: "not-started",
        score: null,
        lastAttempt: null
      }
    }
  ];

  useEffect(() => {
    // Simulate fetching quizzes from API
    setTimeout(() => {
      setQuizzes(mockQuizzes);
    }, 500);
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quiz.companies?.some(company => company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.some(filter => 
                            quiz.difficulty === filter || 
                            quiz.companies?.includes(filter)
                          );
    
    return matchesSearch && matchesFilters;
  });

  const handleStartQuiz = (quizId) => {
    // Navigate to quiz rules page
    navigate('/quiz-rules-instructions');
  };

  const handleViewResults = (quizId) => {
    // Navigate to results review page
    navigate('/results-review');
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Quizzes</h1>
            <p className="text-muted-foreground">
              Access and manage all your assigned quizzes
            </p>
          </div>

          {/* Search and Filters */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchBar 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                  placeholder="Search quizzes by name, company, or skill..." 
                />
              </div>
              <FilterChips 
                activeFilters={activeFilters} 
                onChange={setActiveFilters} 
              />
            </div>
          </div>

          {/* Quizzes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map(quiz => (
                <TestCard 
                  key={quiz.id} 
                  test={quiz} 
                  onStartQuiz={handleStartQuiz}
                  onViewResults={handleViewResults}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState 
                  title="No quizzes found"
                  description="Try adjusting your search or filters to find what you're looking for."
                  icon="Search"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyQuizzes;