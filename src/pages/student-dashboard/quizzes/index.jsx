import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from '../components/StudentNavigation';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TestCard from '../components/TestCard';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import AccountSection from '../../../components/ui/AccountSection';
import * as authService from '../../../utils/authService';
import { listenToUser } from '../../../utils/dbService';

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        
        // Listen to user data for real-time updates
        const unsubscribeUser = listenToUser(user?.id, (userData) => {
          if (userData) {
            setCurrentUser(userData);
          }
        });
        
        return () => {
          unsubscribeUser();
        };
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

  // Mock data for quizzes
  const mockQuizzes = [
    {
      id: 1,
      title: "Microsoft Technical Interview Prep",
      description: "Practice test focusing on technical concepts, coding challenges, and behavioral questions commonly asked at Microsoft.",
      duration: "60 min",
      questionCount: 30,
      difficulty: "medium",
      companies: ["Microsoft", "FAANG"],
      attempts: 124,
      deadline: "2025-10-30",
      isNew: true,
      userProgress: {
        status: "not-started",
        score: null,
        lastAttempt: null
      }
    },
    {
      id: 2,
      title: "Meta Product Sense Assessment",
      description: "Product management and analytical thinking test designed for Meta's product roles and technical positions.",
      duration: "75 min",
      questionCount: 35,
      difficulty: "hard",
      companies: ["Meta", "FAANG"],
      attempts: 89,
      deadline: "2025-10-25",
      isNew: false,
      userProgress: {
        status: "not-started",
        score: null,
        lastAttempt: null
      }
    },
    {
      id: 3,
      title: "Startup Technical Challenge",
      description: "General technical assessment covering full-stack development, problem-solving, and startup mindset evaluation.",
      duration: "120 min",
      questionCount: 50,
      difficulty: "medium",
      companies: ["Mango"],
      attempts: 67,
      deadline: "2025-10-20",
      isNew: true,
      userProgress: {
        status: "not-started",
        score: null,
        lastAttempt: null
      }
    },
    {
      id: 4,
      title: "Google Software Engineer Assessment",
      description: "Comprehensive coding and problem-solving test covering algorithms, data structures, and system design fundamentals.",
      duration: "90 min",
      questionCount: 45,
      difficulty: "hard",
      companies: ["Google", "FAANG"],
      attempts: 156,
      deadline: "2025-10-15",
      isNew: false,
      userProgress: {
        status: "not-started",
        score: null,
        lastAttempt: null
      }
    },
    {
      id: 5,
      title: "Amazon Leadership Principles Quiz",
      description: "Assessment based on Amazon's 16 leadership principles and behavioral interview questions.",
      duration: "45 min",
      questionCount: 25,
      difficulty: "medium",
      companies: ["Amazon", "FAANG"],
      attempts: 203,
      deadline: "2025-10-10",
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
    <div className="flex min-h-screen bg-background">
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
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
                <h1 className="text-3xl font-bold text-foreground mb-2">My Quizzes</h1>
                <p className="text-muted-foreground">
                  Access and manage all your assigned quizzes
                </p>
              </div>
              <Button onClick={() => navigate('/student-dashboard')} variant="outline" iconName="ArrowLeft">
                Back to Dashboard
              </Button>
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
        </div>
      </main>
    </div>
  </div>
);
};

export default MyQuizzes;