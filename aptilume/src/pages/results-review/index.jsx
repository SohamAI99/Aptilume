import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import OverviewSection from './components/OverviewSection';
import QuestionReviewSection from './components/QuestionReviewSection';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import ScoreHeroSection from './components/ScoreHeroSection';
import SocialShareModal from './components/SocialShareModal';
import CertificateModal from './components/CertificateModal';

const ResultsReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get results data from navigation state or generate mock data
  const [resultsData, setResultsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from Firestore if attemptId is in state; fallback to state payload
    const loadResults = async () => {
      setLoading(true);
      try {
        const attemptId = location?.state?.attemptId;
        if (attemptId) {
          const { db } = await import('../../utils/firebase');
          const { doc, getDoc } = await import('firebase/firestore');
          const snap = await getDoc(doc(db, 'attempts', attemptId));
          if (snap.exists()) {
            const a = { id: snap.id, ...snap.data() };
            // Map attempt doc into resultsData shape minimally required by UI
            const mapped = {
              examId: a?.testId,
              examTitle: a?.testTitle || 'Exam',
              submissionTime: a?.completedAt?.toDate?.() || new Date(),
              timeSpent: a?.timeSpentSec || 0,
              overall: {
                score: a?.score || 0,
                totalMarks: a?.totalMarks || 100,
                percentage: a?.percentage || (a?.score ? Math.round((a.score / (a.totalMarks || 100)) * 100) : 0),
                grade: a?.grade || '-',
                rank: a?.rank || null,
                totalCandidates: a?.totalCandidates || null,
                percentile: a?.percentile || null
              },
              subjects: a?.subjects || [],
              questions: a?.questions || []
            };
            setResultsData(mapped);
          } else {
            setResultsData(location?.state || generateMockResultsData());
          }
        } else {
          setResultsData(location?.state || generateMockResultsData());
        }
      } catch (e) {
        console.warn('Failed to load results from Firestore:', e?.message);
        setResultsData(location?.state || generateMockResultsData());
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [location?.state]);

  const generateMockResultsData = () => {
    return {
      examId: "EXAM_2025_001",
      examTitle: "JEE Main Mock Test - Mathematics & Physics",
      submissionTime: new Date(),
      timeSpent: 9000, // 2.5 hours in seconds
      student: {
        name: "Arjun Sharma",
        email: "arjun.sharma@example.com",
        id: "STU2025001"
      },
      overall: {
        score: 245,
        totalMarks: 300,
        percentage: 81.67,
        grade: 'A',
        rank: 1247,
        totalCandidates: 15000,
        percentile: 91.65
      },
      subjects: [
        { name: 'Mathematics', score: 88, total: 100, percentage: 88, questions: 25, correct: 22 },
        { name: 'Physics', score: 84, total: 100, percentage: 84, questions: 25, correct: 21 },
        { name: 'Chemistry', score: 73, total: 100, percentage: 73, questions: 25, correct: 18 }
      ],
      analytics: {
        timeDistribution: [
          { subject: 'Mathematics', time: 3200, percentage: 35.6 },
          { subject: 'Physics', time: 3000, percentage: 33.3 },
          { subject: 'Chemistry', time: 2800, percentage: 31.1 }
        ],
        difficultyAnalysis: [
          { level: 'Easy', attempted: 20, correct: 19, total: 25 },
          { level: 'Medium', attempted: 30, correct: 24, total: 35 },
          { level: 'Hard', attempted: 11, correct: 8, total: 15 }
        ],
        accuracyTrend: [
          { question: 1, accuracy: 95 },
          { question: 10, accuracy: 88 },
          { question: 20, accuracy: 85 },
          { question: 30, accuracy: 82 },
          { question: 40, accuracy: 78 },
          { question: 50, accuracy: 80 },
          { question: 60, accuracy: 83 },
          { question: 75, accuracy: 81 }
        ]
      },
      questions: Array.from({ length: 75 }, (_, i) => ({
        id: i + 1,
        subject: ['Mathematics', 'Physics', 'Chemistry']?.[Math.floor(i / 25)],
        question: `Sample question ${i + 1} content that tests understanding of key concepts...`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        selectedAnswer: Math.random() > 0.2 ? Math.floor(Math.random() * 4) : null,
        correctAnswer: Math.floor(Math.random() * 4),
        isCorrect: Math.random() > 0.2,
        explanation: `Detailed explanation for question ${i + 1}. This explains the concept and reasoning behind the correct answer...`,
        difficulty: ['Easy', 'Medium', 'Hard']?.[Math.floor(Math.random() * 3)],
        marks: [2, 4, 6]?.[Math.floor(Math.random() * 3)],
        timeSpent: Math.floor(Math.random() * 180) + 30,
        topic: `Topic ${Math.floor(Math.random() * 10) + 1}`
      }))
    };
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'questions', label: 'Question Review', icon: 'FileText' },
    { id: 'analytics', label: 'Performance Analytics', icon: 'TrendingUp' }
  ];

  const handleRetakeTest = () => {
    navigate('/quiz-rules-instructions', {
      state: {
        retakeExam: true,
        testId: resultsData?.examId
      }
    });
  };

  const handleBackToDashboard = () => {
    navigate('/student-dashboard', {
      state: {
        message: 'Exam completed successfully!',
        type: 'success'
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin" />
          <h2 className="text-xl font-semibold text-foreground">Processing Results</h2>
          <p className="text-muted-foreground">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="AlertCircle" size={48} className="mx-auto text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Results Not Found</h2>
          <p className="text-muted-foreground">Unable to load exam results.</p>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Score */}
      <ScoreHeroSection 
        resultsData={resultsData}
        onShare={() => setShowShareModal(true)}
        onCertificate={() => setShowCertificateModal(true)}
      />
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-1">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? 'default' : 'ghost'}
                  size="sm"
                  iconName={tab?.icon}
                  iconPosition="left"
                  onClick={() => setActiveTab(tab?.id)}
                  className="text-sm"
                >
                  {tab?.label}
                </Button>
              ))}
            </div>
            
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                iconName="Menu"
                onClick={() => setShowShareModal(true)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewSection resultsData={resultsData} />}
        {activeTab === 'questions' && <QuestionReviewSection resultsData={resultsData} />}
        {activeTab === 'analytics' && <PerformanceAnalytics resultsData={resultsData} />}
      </div>
      {/* Action Footer */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
              
              <Button
                variant="outline"
                iconName="Eye"
                iconPosition="left"
                onClick={() => navigate('/quiz-rules-instructions')}
              >
                View Similar Tests
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              {resultsData?.overall?.percentage >= 60 && (
                <Button
                  variant="success"
                  iconName="Award"
                  iconPosition="left"
                  onClick={() => setShowCertificateModal(true)}
                >
                  Download Certificate
                </Button>
              )}
              
              <Button
                variant="default"
                iconName="RotateCcw"
                iconPosition="left"
                onClick={handleRetakeTest}
              >
                Retake Test
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <SocialShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        resultsData={resultsData}
      />
      <CertificateModal 
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        resultsData={resultsData}
      />
    </div>
  );
};

export default ResultsReview;