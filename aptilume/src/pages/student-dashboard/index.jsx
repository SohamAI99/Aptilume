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
import AIQuizGenerator from '../../components/ai/AIQuizGenerator';
import AIAnalytics from '../../components/ai/AIAnalytics';
import { listenToQuizzes, listenToUser, getAttemptsByUser, getResultsByUser } from '../../utils/dbService';
import * as authService from '../../utils/authService';
import Button from '../../components/ui/Button';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCustomQuiz, setShowCustomQuiz] = useState(false);
  const [showAIQuizGenerator, setShowAIQuizGenerator] = useState(false);
  const [showAIAnalytics, setShowAIAnalytics] = useState(false);
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

  // Realtime quick stats from Firestore
  const [quickStats, setQuickStats] = useState(null);
  useEffect(() => {
    let unsub;
    (async () => {
      const { db } = await import('../../utils/firebase');
      const { doc, onSnapshot } = await import('firebase/firestore');
      const { auth } = await import('../../utils/firebase');

      const unsubscribe = authService.auth.onAuthStateChanged((u) => {
        if (unsub) unsub();
        if (!u) return setQuickStats(null);
        const statsDoc = doc(db, 'user_stats', u.uid);
        unsub = onSnapshot(statsDoc, (snap) => setQuickStats(snap.exists() ? snap.data() : null));
      });
      
      return () => { if (unsubscribe) unsubscribe(); if (unsub) unsub(); };
    })();
  }, []);

  const mockUser = {
    id: currentUser?.uid || "1",
    name: currentUser?.name || currentUser?.displayName || "User",
    email: currentUser?.email || "",
    studentId: "",
    avatar: currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    userType: currentUser?.userType || "student"
  };

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      navigate('/authentication-login-register');
    }
  };

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

  // Mock active tests data (will be removed when Firestore has data)
  const mockActiveTests = [
    {
      id: 1,
      title: "Google Software Engineer Assessment",
      description: "Comprehensive coding and problem-solving test covering algorithms, data structures, and system design fundamentals.",
      duration: "90 min",
      questionCount: 45,
      difficulty: "Hard",
      companies: ["Google", "FAANG"],
      attempts: 1247,
      deadline: "2025-01-15",
      isNew: true
    },
    {
      id: 2,
      title: "Microsoft Technical Interview Prep",
      description: "Practice test focusing on technical concepts, coding challenges, and behavioral questions commonly asked at Microsoft.",
      duration: "60 min",
      questionCount: 30,
      difficulty: "Medium",
      companies: ["Microsoft", "FAANG"],
      attempts: 892,
      isNew: false
    },
    {
      id: 3,
      title: "Amazon Leadership Principles Quiz",
      description: "Assessment based on Amazon's 16 leadership principles with scenario-based questions and case studies.",
      duration: "45 min",
      questionCount: 25,
      difficulty: "Easy",
      companies: ["Amazon", "FAANG"],
      attempts: 2156,
      isNew: false
    },
    {
      id: 4,
      title: "Meta Product Sense Assessment",
      description: "Product management and analytical thinking test designed for Meta's product roles and technical positions.",
      duration: "75 min",
      questionCount: 35,
      difficulty: "Hard",
      companies: ["Meta", "FAANG"],
      attempts: 634,
      deadline: "2025-01-20",
      isNew: true
    },
    {
      id: 5,
      title: "Startup Technical Challenge",
      description: "General technical assessment covering full-stack development, problem-solving, and startup mindset evaluation.",
      duration: "120 min",
      questionCount: 50,
      difficulty: "Medium",
      companies: ["Mango"],
      attempts: 445,
      isNew: false
    }
  ];

  // Realtime recent attempts data
  const [recentAttempts, setRecentAttempts] = useState([]);
  useEffect(() => {
    let unsub;
    (async () => {
      const { auth } = await import('../../utils/firebase');

      const unsubscribe = authService.auth.onAuthStateChanged(async (u) => {
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

  // Fallback mock removed — will show empty when none

  // Realtime recommended tests (use same tests collection, filtered by isRecommended flag)
  const [recommendedTests, setRecommendedTests] = useState([]);
  useEffect(() => {
    let unsub;
    (async () => {
      const { auth } = await import('../../utils/firebase');

      const unsubscribe = authService.auth.onAuthStateChanged((u) => {
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

  const handleProfile = () => {
    navigate('/student/profile');
  };

  const handleSettings = () => {
    navigate('/student/settings');
  };

  const handleAttemptHistory = () => {
    navigate('/attempt-history');
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
      <StudentNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 pt-6">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
              {activeTab === 'dashboard' ? (
                <>
                  {/* Quick Stats */}
                  <QuickStatsWidget stats={quickStats} />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Search and Filters */}
                      <div className="glass-card rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <SearchBar 
                              value={searchQuery} 
                              onChange={setSearchQuery} 
                              placeholder="Search tests by name, company, or skill..." 
                            />
                          </div>
                          <FilterChips 
                            activeFilters={activeFilters} 
                            onChange={setActiveFilters} 
                          />
                        </div>
                      </div>

                      {/* Active Tests */}
                      <section>
                        <SectionHeader
                          title="Active Tests"
                          subtitle="Latest assessments available for practice"
                          icon="Zap"
                          actionLabel="View All"
                          onAction={() => console.log('View all tests')}
                          count={filteredTests.length}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredTests.length > 0 ? (
                            filteredTests.map(test => (
                              <TestCard key={test.id} test={test} />
                            ))
                          ) : (
                            <EmptyState 
                              title="No tests found"
                              description="Try adjusting your search or filters to find what you're looking for."
                              icon="Search"
                            />
                          )}
                        </div>
                      </section>

                      {/* Recent Attempts */}
                      <section>
                        <SectionHeader
                          title="Recent Attempts"
                          subtitle="Your latest test performances"
                          icon="History"
                          actionLabel="View All"
                          onAction={handleAttemptHistory}
                          count={recentAttempts.length}
                        />
                        <div className="space-y-3">
                          {recentAttempts.length > 0 ? (
                            recentAttempts.map(attempt => (
                              <AttemptCard key={attempt.id} attempt={attempt} />
                            ))
                          ) : (
                            <EmptyState 
                              title="No attempts yet"
                              description="Take a test to see your performance history here."
                              icon="FileText"
                            />
                          )}
                        </div>
                      </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Recommended Tests */}
                      <section className="glass-card rounded-2xl p-6">
                        <SectionHeader
                          title="Recommended"
                          subtitle="Tests tailored for you"
                          icon="Star"
                          actionLabel="View All"
                          onAction={() => console.log('View all recommended')}
                          count={filteredRecommendedTests.length}
                        />
                        <div className="space-y-3">
                          {filteredRecommendedTests.length > 0 ? (
                            filteredRecommendedTests.slice(0, 3).map(test => (
                              <TestCard key={test.id} test={test} compact />
                            ))
                          ) : (
                            <EmptyState 
                              title="No recommendations"
                              description="Complete more tests to get personalized recommendations."
                              icon="Star"
                              size="sm"
                            />
                          )}
                        </div>
                      </section>

                      {/* Quick Actions */}
                      <section className="glass-card rounded-2xl p-6">
                        <SectionHeader
                          title="Quick Actions"
                          subtitle="Frequently used features"
                          icon="Zap"
                          actionLabel="View More"
                          onAction={() => console.log('View more actions')}
                          count={3}
                        />
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => setShowAIQuizGenerator(true)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <Icon name="Sparkles" size={18} className="text-accent" />
                            <div>
                              <div className="font-medium text-foreground">AI Quiz Generator</div>
                              <div className="text-xs text-muted-foreground">Create custom quizzes with AI</div>
                            </div>
                          </button>

                          <button
                            onClick={() => setShowCustomQuiz(true)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <Icon name="PlusCircle" size={18} className="text-success" />
                            <div>
                              <div className="font-medium text-foreground">Create Custom Quiz</div>
                              <div className="text-xs text-muted-foreground">Add your own questions and start</div>
                            </div>
                          </button>

                          <button
                            onClick={() => navigate('/quiz-rules-instructions')}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <Icon name="BookOpen" size={18} className="text-primary" />
                            <div>
                              <div className="font-medium text-foreground">Practice Mode</div>
                              <div className="text-xs text-muted-foreground">Take a quick practice test</div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => setShowAIAnalytics(true)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <Icon name="BarChart3" size={18} className="text-accent" />
                            <div>
                              <div className="font-medium text-foreground">Performance Analytics</div>
                              <div className="text-xs text-muted-foreground">View detailed insights</div>
                            </div>
                          </button>
                        </div>
                      </section>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-6">
                  <AIAnalytics />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showCustomQuiz && (
        <CustomQuizModal
          onClose={() => setShowCustomQuiz(false)}
          onCreated={(testId, test) => {
            // After creation, go straight to rules with the new test data
            navigate('/quiz-rules-instructions', { state: { testId, test } });
          }}
        />
      )}

      {showAIQuizGenerator && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AIQuizGenerator 
            onQuizGenerated={(quizId, quiz) => {
              setShowAIQuizGenerator(false);
              // Navigate to the newly created quiz
              navigate('/quiz-rules-instructions', { state: { testId: quizId, test: quiz } });
            }}
            onCancel={() => setShowAIQuizGenerator(false)}
          />
        </div>
      )}

      {showAIAnalytics && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Performance Analytics</h2>
              <Button variant="ghost" onClick={() => setShowAIAnalytics(false)} iconName="X" size="icon" />
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <AIAnalytics />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;