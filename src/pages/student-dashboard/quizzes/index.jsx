import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Filter } from 'lucide-react';
import StudentNavigation from '../components/StudentNavigation';
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
          // Update user data if needed
        });
        
        // Fetch quizzes data
        // This would typically come from your database
        const mockQuizzes = [
          {
            id: '1',
            title: 'Quantitative Aptitude Test',
            description: 'Comprehensive assessment of mathematical reasoning and problem-solving skills',
            questionCount: 25,
            duration: 30,
            difficulty: 'medium',
            company: 'General',
            attempts: 124,
            avgScore: 72,
            passRate: 68
          },
          {
            id: '2',
            title: 'Logical Reasoning Challenge',
            description: 'Test your analytical and logical thinking abilities',
            questionCount: 20,
            duration: 25,
            difficulty: 'hard',
            company: 'TechCorp',
            attempts: 89,
            avgScore: 65,
            passRate: 55
          },
          {
            id: '3',
            title: 'Verbal Ability Assessment',
            description: 'Evaluate your command of English language and comprehension skills',
            questionCount: 30,
            duration: 35,
            difficulty: 'easy',
            company: 'EduSoft',
            attempts: 156,
            avgScore: 78,
            passRate: 82
          }
        ];
        setQuizzes(mockQuizzes);
        
        return () => {
          unsubscribeUser();
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Filter quizzes based on search and filters
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For demo purposes, we're not implementing filter logic
    // In a real app, you would filter based on activeFilters
    return matchesSearch;
  });

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
      
      {/* Main Content Area with margin to accommodate sidebar */}
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
        
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">My Quizzes</h1>
                  <p className="text-muted-foreground">Browse and take available assessments</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
                  Filters
                </Button>
              </div>

              {/* Filter Chips */}
              <FilterChips 
                activeFilters={activeFilters} 
                onFilterChange={handleFilterChange} 
              />

              {/* Quizzes Grid */}
              {filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredQuizzes.map((quiz) => (
                    <TestCard 
                      key={quiz.id} 
                      test={quiz} 
                      onStartTest={() => console.log('Starting quiz:', quiz.id)} 
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="BookOpen"
                  title="No Quizzes Found"
                  description="There are no quizzes matching your search criteria. Try adjusting your search or filters."
                  actionLabel="Browse All Quizzes"
                  onAction={() => {
                    setSearchQuery('');
                    setActiveFilters([]);
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyQuizzes;