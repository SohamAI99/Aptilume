import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentNavigation from './components/StudentNavigation';
import QuickStatsWidget from './components/QuickStatsWidget';
import TestCard from './components/TestCard';
import AttemptCard from './components/AttemptCard';
import FilterChips from './components/FilterChips';
import SearchBar from './components/SearchBar';
import SectionHeader from './components/SectionHeader';
import EmptyState from './components/EmptyState';
import Icon from '../../components/AppIcon';
import CustomQuizModal from './components/CustomQuizModal';
import { listenToQuizzes, listenToUser, getAttemptsByUser, getResultsByUser } from '../../utils/dbService';
import * as authService from '../../utils/authService';
import { auth } from '../../utils/firebase'; // Import auth directly
import Button from '../../components/ui/Button';
import AccountSection from '../../components/ui/AccountSection';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCustomQuiz, setShowCustomQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, analytics
  const [seedingData, setSeedingData] = useState(false);
  const [seedError, setSeedError] = useState('');

  // Realtime user data from Firestore
  const [currentUser, setCurrentUser] = useState(null);
  const [userUnsubscribe, setUserUnsubscribe] = useState(null);

  useEffect(() => {
    let unsubscribe;
    const setupUserListener = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user?.uid) {
          unsubscribe = listenToUser(user.uid, (userData) => {
            setCurrentUser(userData);
          });
          setUserUnsubscribe(() => unsubscribe);
        }
      } catch (error) {
        console.error('Error setting up user listener:', error);
      }
    };

    setupUserListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      navigate('/authentication-login-register');
    }
  };

  // Realtime quick stats from Firestore
  const [quickStats, setQuickStats] = useState(null);
  useEffect(() => {
    let unsub;
    (async () => {
      const { db } = await import('../../utils/firebase');
      const { doc, onSnapshot } = await import('firebase/firestore');

      // Use auth directly instead of authService.auth
      const unsubscribe = auth.onAuthStateChanged((u) => {
        if (unsub) unsub();
        if (!u) return setQuickStats(null);
        const statsDoc = doc(db, 'user_stats', u.uid);
        unsub = onSnapshot(statsDoc, (snap) => setQuickStats(snap.exists() ? snap.data() : null));
      });
      
      return () => { if (unsubscribe) unsubscribe(); if (unsub) unsub(); };
    })();
  }, []);

  // Realtime tests from Firestore
  const [activeTests, setActiveTests] = useState([]);
  const [testsUnsubscribe, setTestsUnsubscribe] = useState(null);

  useEffect(() => {
    let unsubscribe;
    const setupTestsListener = () => {
      unsubscribe = listenToQuizzes((tests) => {
        setActiveTests(tests);
      }, { isPublished: true });
      setTestsUnsubscribe(() => unsubscribe);
    };

    setupTestsListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Realtime recent attempts data
  const [recentAttempts, setRecentAttempts] = useState([]);
  useEffect(() => {
    let unsub;
    (async () => {

      // Use auth directly instead of authService.auth
      const unsubscribe = auth.onAuthStateChanged(async (u) => {
        if (unsub) unsub();
        if (!u) return setRecentAttempts([]);
        
        try {
          const attempts = await getAttemptsByUser(u.uid, 10);
          setRecentAttempts(attempts);
        } catch (error) {
          console.error('Error fetching attempts:', error);
        }
      });
      
      return () => { if (unsubscribe) unsubscribe(); if (unsub) unsub(); };
    })();
  }, []);

  // Realtime recommended tests (use same tests collection, filtered by isRecommended flag)
  const [recommendedTests, setRecommendedTests] = useState([]);
  useEffect(() => {
    let unsub;
    (async () => {

      // Use auth directly instead of authService.auth
      const unsubscribe = auth.onAuthStateChanged((u) => {
        if (unsub) unsub();
        if (!u) return setRecommendedTests([]);
        unsub = listenToQuizzes(setRecommendedTests, { isRecommended: true, isPublished: true });
      });
      
      return () => { if (unsubscribe) unsubscribe(); if (unsub) unsub(); };
    })();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL without refresh
    const newUrl = `${location.pathname}?tab=${tab}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Check URL for tab parameter on load
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['dashboard', 'analytics'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Filter tests based on search and filters
  const filteredTests = activeTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.companies?.some(company => company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.some(filter => 
                            test.difficulty === filter || 
                            test.companies?.includes(filter)
                          );
    
    return matchesSearch && matchesFilters;
  });

  const filteredRecommendedTests = recommendedTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.companies?.some(company => company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.some(filter => 
                            test.difficulty === filter || 
                            test.companies?.includes(filter)
                          );
    
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
          <div className="max-w-full mx-auto px-4 sm:px-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, {currentUser?.name || 'Student'}!
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Ready to take on today's challenges?
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowCustomQuiz(true)} 
                    variant="outline" 
                    iconName="Plus"
                  >
                    Custom Quiz
                  </Button>
                  <Button 
                    onClick={() => navigate('/student/analytics')} 
                    variant="default" 
                    iconName="BarChart3"
                  >
                    Analytics
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <QuickStatsWidget stats={quickStats} />
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Search tests by name, company, or skill..."
              />
              <FilterChips 
                activeFilters={activeFilters} 
                onChange={setActiveFilters} 
              />
            </div>

            {/* Recommended Tests Section */}
            <SectionHeader 
              title="Recommended for You" 
              subtitle="Based on your performance and interests"
              actionText="View All"
              onAction={() => console.log('View all recommended')}
            />
            
            {filteredRecommendedTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredRecommendedTests.map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon="Star"
                title="No recommendations yet"
                description="Take some tests to get personalized recommendations"
              />
            )}

            {/* All Tests Section */}
            <SectionHeader 
              title="All Practice Tests" 
              subtitle="Browse our complete collection of practice tests"
              count={filteredTests.length}
            />
            
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map(test => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon="FileText"
                title="No tests found"
                description="Try adjusting your search or filter criteria"
              />
            )}

            {/* Recent Attempts Section */}
            <div className="mt-12">
              <SectionHeader 
                title="Recent Attempts" 
                subtitle="Your most recent test attempts"
                actionText="View All"
                onAction={() => navigate('/attempt-history')}
              />
              
              {recentAttempts.length > 0 ? (
                <div className="space-y-4">
                  {recentAttempts.map(attempt => (
                    <AttemptCard key={attempt.id} attempt={attempt} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon="Clock"
                  title="No recent attempts"
                  description="Take a test to see your recent attempts here"
                />
              )}
            </div>
          </div>
        </main>

        {/* Custom Quiz Modal */}
        {showCustomQuiz && (
          <CustomQuizModal 
            onClose={() => setShowCustomQuiz(false)} 
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;