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
  
  // Get results data from Firestore using attemptId
  const [resultsData, setResultsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load from Firestore using attemptId
    const loadResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const attemptId = location?.state?.attemptId;
        if (!attemptId) {
          throw new Error('No attempt ID provided');
        }

        const { db, auth } = await import('../../utils/firebase');
        const { doc, getDoc, collection, getDocs, query, where, orderBy } = await import('firebase/firestore');

        // Load attempt data from Firestore
        const attemptDoc = await getDoc(doc(db, 'attempts', attemptId));
        if (!attemptDoc.exists()) {
          throw new Error('Attempt data not found');
        }

        const attemptData = attemptDoc.data();
        const user = auth.currentUser;

        // Load user data
        let userData = null;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userData = userDoc.data();
          }
        }

        // Load saved answers
        const answersQuery = query(collection(db, 'attempts', attemptId, 'answers'));
        const answersSnapshot = await getDocs(answersQuery);
        const savedAnswers = {};
        
        answersSnapshot.forEach(doc => {
          const data = doc.data();
          savedAnswers[data.questionId] = data.selected;
        });

        // Load questions from the quiz
        let questions = [];
        if (attemptData.testId) {
          const questionsQuery = query(
            collection(db, 'quizzes', attemptData.testId, 'questions'),
            orderBy('createdAt', 'asc')
          );
          const questionsSnapshot = await getDocs(questionsQuery);
          questions = questionsSnapshot.docs.map(doc => {
            const questionData = doc.data();
            const questionId = doc.id;
            const selectedAnswer = savedAnswers[questionId];
            const isCorrect = selectedAnswer === questionData.correctAnswer;
            
            return {
              id: questionId,
              subject: questionData.subject || questionData.category || 'General',
              question: questionData.text || questionData.question || 'Question text not available',
              options: questionData.options || [],
              selectedAnswer: selectedAnswer,
              correctAnswer: questionData.correctAnswer,
              isCorrect: isCorrect,
              explanation: questionData.explanation || 'No explanation available',
              difficulty: questionData.difficulty || 'Medium',
              marks: questionData.marks || 4,
              timeSpent: 0, // We don't track time per question in this implementation
              topic: questionData.topic || questionData.category || 'General'
            };
          });
        }

        // Calculate subject breakdown
        const subjectsMap = {};
        questions.forEach(q => {
          const subject = q.subject;
          if (!subjectsMap[subject]) {
            subjectsMap[subject] = {
              name: subject,
              score: 0,
              total: 0,
              correct: 0,
              questions: 0
            };
          }
          
          subjectsMap[subject].questions += 1;
          subjectsMap[subject].total += q.marks;
          if (q.isCorrect) {
            subjectsMap[subject].score += q.marks;
            subjectsMap[subject].correct += 1;
          }
        });

        const subjects = Object.values(subjectsMap);

        // Create results data structure
        const mappedResults = {
          examId: attemptData.testId,
          examTitle: attemptData.testTitle || 'Exam',
          submissionTime: attemptData.completedAt?.toDate?.() || new Date(),
          timeSpent: attemptData.timeSpentSec || 0,
          student: {
            name: userData?.name || user?.displayName || 'Student',
            email: user?.email || 'student@example.com',
            id: user?.uid || 'STU001'
          },
          overall: {
            score: attemptData.score || 0,
            totalMarks: attemptData.totalMarks || 100,
            percentage: attemptData.percentage || 0,
            grade: attemptData.grade || calculateGrade(attemptData.percentage || 0),
            rank: attemptData.rank || null,
            totalCandidates: attemptData.totalCandidates || null,
            percentile: attemptData.percentile || null
          },
          subjects: subjects,
          questions: questions,
          attemptId: attemptId
        };

        setResultsData(mappedResults);
      } catch (err) {
        console.error('Error loading results:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [location?.state?.attemptId]);

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
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

  const handleViewSimilarTests = () => {
    navigate('/student/quizzes');
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 glass-card rounded-2xl p-6 max-w-md">
          <Icon name="AlertCircle" size={48} className="mx-auto text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Error Loading Results</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Button variant="outline" onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </div>
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
                iconName="LayoutDashboard"
                iconPosition="left"
                onClick={handleBackToDashboard}
              >
                Dashboard
              </Button>
              
              <Button
                variant="outline"
                iconName="Eye"
                iconPosition="left"
                onClick={handleViewSimilarTests}
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