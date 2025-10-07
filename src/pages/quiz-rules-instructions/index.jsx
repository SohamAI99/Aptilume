import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import TestOverviewCard from './components/TestOverviewCard';
import InstructionsSection from './components/InstructionsSection';
import TechnicalRequirements from './components/TechnicalRequirements';
import CompanySpecificInfo from './components/CompanySpecificInfo';
import ProgressIndicator from './components/ProgressIndicator';
import ActionButtons from './components/ActionButtons';
import Icon from '../../components/AppIcon';

const QuizRulesInstructions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);

  // Load auth user
  useEffect(() => {
    (async () => {
      const { auth } = await import('../../utils/firebase');
      setUser({
        id: auth.currentUser?.uid,
        name: auth.currentUser?.displayName || 'Student',
        email: auth.currentUser?.email || 'student@example.com',
        studentId: auth.currentUser?.uid?.slice(0, 8) || '—'
      });
    })();
  }, []);

  // Load test data from navigation state (mock data) or Firestore
  const [testData, setTestData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [testStats, setTestStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    averageTime: 0,
    passRate: 0,
    topScore: 0,
    lastUpdated: new Date()
  });

  useEffect(() => {
    (async () => {
      try {
        // First check if test data is passed in location state (from TestCard)
        const navTest = location?.state?.test;
        const testId = location?.state?.testId || navTest?.id;
        
        let data = navTest;
        
        // If no test data in navigation state, try to load from Firestore
        if (!data && testId) {
          try {
            const { db } = await import('../../utils/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            // Use 'quizzes' collection instead of 'tests'
            const snap = await getDoc(doc(db, 'quizzes', testId));
            if (snap.exists()) {
              data = { id: snap.id, ...snap.data() };
            }
          } catch (firestoreError) {
            console.warn('Failed to load test from Firestore:', firestoreError?.message);
          }
        }
        
        // If we have test data (either from navigation state or Firestore), use it
        if (data) {
          setTestData(data);
          setCompanyData({
            name: data?.company || data?.companies?.[0] || 'Company',
            category: data?.category || 'General',
            level: data?.difficulty || '—',
            logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center',
            description: data?.description || ''
          });
          setTestStats((prev) => ({
            ...prev,
            totalAttempts: data?.attempts || data?.stats?.totalAttempts || 0,
            averageTime: data?.duration || 0,
            lastUpdated: new Date()
          }));
        } else {
          // Set default test data for mock quizzes
          const defaultTestData = {
            id: testId || 'mock-1',
            title: 'Mock Quiz',
            description: 'This is a mock quiz for demonstration purposes.',
            difficulty: 'medium',
            duration: 30,
            questionCount: 25,
            company: 'AptiLume',
            attempts: 0,
            avgScore: 0,
            passRate: 0,
            companies: ['AptiLume'],
            category: 'General'
          };
          setTestData(defaultTestData);
          setCompanyData({
            name: 'AptiLume',
            category: 'General',
            level: 'Medium',
            logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center',
            description: 'This is a mock quiz for demonstration purposes.'
          });
        }
      } catch (e) {
        console.warn('Failed to load test:', e?.message);
        // Set default test data as fallback
        const defaultTestData = {
          id: 'mock-1',
          title: 'Mock Quiz',
          description: 'This is a mock quiz for demonstration purposes.',
          difficulty: 'medium',
          duration: 30,
          questionCount: 25,
          company: 'AptiLume',
          attempts: 0,
          avgScore: 0,
          passRate: 0,
          companies: ['AptiLume'],
          category: 'General'
        };
        setTestData(defaultTestData);
        setCompanyData({
          name: 'AptiLume',
          category: 'General',
          level: 'Medium',
          logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center',
          description: 'This is a mock quiz for demonstration purposes.'
        });
      }
    })();
  }, [location?.state?.testId, location?.state?.test]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'instructions', label: 'Instructions', icon: 'BookOpen' },
    { id: 'technical', label: 'Technical', icon: 'Settings' },
    { id: 'company', label: 'Company Focus', icon: 'Building' },
    { id: 'stats', label: 'Statistics', icon: 'BarChart3' }
  ];

  const handleLogout = () => {
    // Handle logout logic
    navigate('/authentication-login-register');
  };

  const handleProceedToTest = async () => {
    // Store test data in session/context for next screen
    sessionStorage.setItem('currentTest', JSON.stringify(testData));
    sessionStorage.setItem('fromRules', '1');
    // Set the fullscreen requirement flag
    sessionStorage.setItem('examFullscreenRequired', 'true');
    navigate('/password-gate-verification', { state: { fromRules: true, testId: testData?.id } });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <TestOverviewCard testData={testData} />;
      case 'instructions':
        return <InstructionsSection />;
      case 'technical':
        return <TechnicalRequirements />;
      case 'company':
        return <CompanySpecificInfo companyData={companyData} />;
      case 'stats':
        return <ProgressIndicator testStats={testStats} />;
      default:
        return <TestOverviewCard testData={testData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader user={user} onLogout={handleLogout} />
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <Icon name="FileText" size={32} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Rules & Instructions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Please read through all sections carefully before proceeding to the exam. 
              Understanding these guidelines will help ensure a smooth testing experience.
            </p>
          </div>

          {/* Test Title Card */}
          <div className="glass-card rounded-2xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Award" size={24} color="white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{testData?.title}</h2>
                <p className="text-sm text-muted-foreground">{testData?.company || testData?.companies?.[0]} • {testData?.difficulty} Level</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {testData?.description}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="glass-card rounded-2xl p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="hidden sm:inline">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {renderTabContent()}
          </div>

          {/* Action Buttons */}
          <ActionButtons 
            testData={testData} 
            onProceed={handleProceedToTest}
          />

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Shield" size={16} />
              <span>Secure • Proctored • Single Attempt</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              © {new Date()?.getFullYear()} AptiLume. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizRulesInstructions;