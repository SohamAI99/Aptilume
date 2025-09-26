import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';

import QuestionCard from './components/QuestionCard';
import QuestionPalette from './components/QuestionPalette';
import ExamHeader from './components/ExamHeader';
import SubmitConfirmationModal from './components/SubmitConfirmationModal';
import MobilePaletteModal from './components/MobilePaletteModal';
import ProctoringSidebar from './components/ProctoringSidebar';
import { auth } from '../../utils/firebase'; // Import auth directly

const ExamInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examStartTimeRef = useRef(new Date());

  // State management
  const [examData, setExamData] = useState({
    id: null,
    title: "Loading...",
    duration: 0,
    totalQuestions: 0,
    questions: []
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(new Map());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  // Using Firestore test duration when available (seconds)
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isProctoringSidebarOpen, setIsProctoringSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examStartTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proctoringViolations, setProctoringViolations] = useState([]);
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(false);

  // Load test questions from Firestore
  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);
        const attemptId = location?.state?.attemptId || sessionStorage.getItem('currentAttemptId');
        const testId = location?.state?.testId;
        
        if (!attemptId || !testId) {
          throw new Error('Missing attempt or test ID');
        }

        const { db, auth } = await import('../../utils/firebase');
        const { doc, getDoc, collection, getDocs, orderBy, query, updateDoc, serverTimestamp } = await import('firebase/firestore');

        // Load attempt data to get test reference
        const attemptDoc = await getDoc(doc(db, 'attempts', attemptId));
        if (!attemptDoc.exists()) {
          throw new Error('Attempt not found');
        }

        const attemptData = attemptDoc.data();
        
        // Load test data
        const testDoc = await getDoc(doc(db, 'quizzes', testId));
        if (!testDoc.exists()) {
          throw new Error('Test not found');
        }

        const testData = testDoc.data();
        
        // Load questions from subcollection with comprehensive error handling
        let questions = [];
        try {
          console.log('Attempting to load questions for testId:', testId);
          
          // Try with ordering first
          const questionsQuery = query(
            collection(db, 'quizzes', testId, 'questions'),
            orderBy('createdAt', 'asc')
          );
          
          const questionsSnapshot = await getDocs(questionsQuery);
          console.log('Questions snapshot size with ordering:', questionsSnapshot.size);
          
          // Convert snapshot to array of questions
          questionsSnapshot.forEach((doc) => {
            try {
              const questionData = doc.data();
              console.log('Processing question document:', doc.id, questionData);
              questions.push({
                id: doc.id,
                ...questionData
              });
            } catch (docError) {
              console.error('Error processing question document:', doc.id, docError);
            }
          });
          
          // If no questions found with ordering, try without ordering
          if (questions.length === 0) {
            console.log('No questions found with ordering, trying without ordering');
            const questionsSnapshot = await getDocs(collection(db, 'quizzes', testId, 'questions'));
            console.log('Questions snapshot size without ordering:', questionsSnapshot.size);
            
            questionsSnapshot.forEach((doc) => {
              try {
                const questionData = doc.data();
                console.log('Processing question document (no order):', doc.id, questionData);
                questions.push({
                  id: doc.id,
                  ...questionData
                });
              } catch (docError) {
                console.error('Error processing question document:', doc.id, docError);
              }
            });
          }
        } catch (queryError) {
          console.error('Error querying questions with ordering:', queryError);
          // Try alternative approach without ordering
          try {
            const questionsSnapshot = await getDocs(collection(db, 'quizzes', testId, 'questions'));
            console.log('Fallback questions snapshot size:', questionsSnapshot.size);
            
            questionsSnapshot.forEach((doc) => {
              try {
                const questionData = doc.data();
                console.log('Processing question document (fallback):', doc.id, questionData);
                questions.push({
                  id: doc.id,
                  ...questionData
                });
              } catch (docError) {
                console.error('Error processing question document:', doc.id, docError);
              }
            });
          } catch (fallbackError) {
            console.error('Fallback query also failed:', fallbackError);
          }
        }

        console.log('Total questions loaded:', questions.length);
        console.log('Raw questions data:', questions);

        // Ensure all questions have the correct structure
        const formattedQuestions = questions.map((question, index) => {
          // Ensure options is an array
          let options = [];
          if (Array.isArray(question.options)) {
            options = [...question.options];
          } else if (typeof question.options === 'object' && question.options !== null) {
            // Convert object to array if it's an object
            options = Object.values(question.options);
          } else if (question.options) {
            // If it's a string or other type, convert to array
            options = [question.options];
          } else {
            // Default options if none provided
            options = ['Option A', 'Option B', 'Option C', 'Option D'];
          }
          
          // Ensure we have at least 4 options
          while (options.length < 4) {
            options.push(`Option ${String.fromCharCode(65 + options.length)}`);
          }
          
          // Ensure we don't have more than 4 options
          if (options.length > 4) {
            options = options.slice(0, 4);
          }
          
          // Ensure we have a proper question text
          const questionText = question.text || question.question || `Question ${index + 1}`;
          
          // Ensure we have an explanation
          const explanation = question.explanation || 'No explanation provided';
          
          // Ensure we have a difficulty level
          const difficulty = question.difficulty || 'Medium';
          
          // Ensure we have a category
          const category = question.category || question.topic || 'General';
          
          // Ensure we have marks
          const marks = question.marks || 4;
          
          // Ensure we have a correct answer
          const correctAnswer = question.correctAnswer !== undefined ? question.correctAnswer : 0;
          
          return {
            id: question.id || `question-${index}`,
            text: questionText,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation,
            difficulty: difficulty,
            category: category,
            marks: marks,
            ...question // Keep any additional properties
          };
        });

        console.log('Formatted questions count:', formattedQuestions.length);
        console.log('Formatted questions:', formattedQuestions);

        // Validate that we have questions
        if (formattedQuestions.length === 0) {
          console.error('No questions found for test:', testId);
          throw new Error('No questions available for this test');
        }

        // Update attempt with test details
        await updateDoc(doc(db, 'attempts', attemptId), {
          testTitle: testData.title,
          totalQuestions: formattedQuestions.length,
          updatedAt: serverTimestamp()
        });

        const examData = {
          id: testId,
          title: testData.title || 'Exam',
          duration: testData.duration ? testData.duration * 60 : 3600, // Convert minutes to seconds
          totalQuestions: formattedQuestions.length,
          questions: formattedQuestions
        };

        console.log('Final exam data:', examData);

        setExamData(examData);
        setTimeRemaining(examData.duration);
        setLoading(false);
      } catch (err) {
        console.error('Error loading test data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadTestData();
  }, [location?.state?.attemptId, location?.state?.testId]);

  // Timer effect
  useEffect(() => {
    if (loading || examData.duration === 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examData.duration]);

  // Auto-submit when time runs out
  const handleAutoSubmit = useCallback(async () => {
    try {
      const { db } = await import('../../utils/firebase');
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      const attemptId = location?.state?.attemptId || sessionStorage.getItem('currentAttemptId');
      await updateDoc(doc(db, 'attempts', attemptId), {
        status: 'completed',
        autoSubmitted: true,
        completedAt: serverTimestamp(),
      });
      navigate('/results-review', { state: { attemptId } });
    } catch (e) {
      navigate('/student-dashboard', {
        state: { message: 'Exam auto-submitted due to time expiry', type: 'warning' }
      });
    }
  }, [navigate, location?.state?.attemptId]);

  // Prevent navigation during exam
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e?.preventDefault();
      e.returnValue = 'You have an active exam. Leaving will end your session.';
      return e?.returnValue;
    };

    const handlePopState = (e) => {
      e?.preventDefault();
      const confirmExit = window.confirm('You cannot navigate away during an active exam. Do you want to exit?');
      if (confirmExit) {
        navigate('/student-dashboard');
      } else {
        window.history?.pushState(null, '', window.location?.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.history?.pushState(null, '', window.location?.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Question navigation handlers
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions(prev => new Set([...prev, index]));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionSelect(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < examData?.questions?.length - 1) {
      handleQuestionSelect(currentQuestionIndex + 1);
    }
  };

  const handleSaveAndNext = () => {
    // Auto-save current answer if selected
    const currentAnswer = answers?.get(currentQuestionIndex);
    if (currentAnswer !== undefined) {
      console.log(`Saved answer for question ${currentQuestionIndex + 1}: ${currentAnswer}`);
    }
    handleNext();
  };

  const handleAnswerSelect = async (answerId) => {
    setAnswers(prev => {
      const newMap = new Map(prev);
      newMap.set(currentQuestionIndex, answerId);
      return newMap;
    });

    // Persist answer to Firestore for resilience (resume support)
    try {
      const attemptId = location?.state?.attemptId || sessionStorage.getItem('currentAttemptId');
      if (attemptId) {
        const { db } = await import('../../utils/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        const currentQuestion = examData?.questions?.[currentQuestionIndex];
        
        if (currentQuestion) {
          await setDoc(
            doc(db, 'attempts', attemptId, 'answers', String(currentQuestion?.id)),
            {
              questionId: currentQuestion?.id,
              selected: answerId,
              index: currentQuestionIndex,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      }
    } catch (e) {
      console.warn('Failed to save answer:', e?.message);
    }
  };

  const handleMarkForReview = () => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(currentQuestionIndex)) {
        newSet?.delete(currentQuestionIndex);
      } else {
        newSet?.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      // Persist attempt results to Firestore
      const { db, auth } = await import('../../utils/firebase');
      const { doc, updateDoc, serverTimestamp, getDocs, collection, query, where, getDoc: getDocFirebase, addDoc } = await import('firebase/firestore');

      const attemptId = location?.state?.attemptId;
      const testId = location?.state?.testId;

      // Calculate score by comparing answers with correct answers
      let correct = 0;
      const totalQuestions = examData?.questions?.length || 0;
      
      // Get all saved answers
      const answersQuery = query(collection(db, 'attempts', attemptId, 'answers'));
      const answersSnapshot = await getDocs(answersQuery);
      const savedAnswers = {};
      
      answersSnapshot.forEach(doc => {
        const data = doc.data();
        savedAnswers[data.questionId] = data.selected;
      });

      // Compare with correct answers
      examData?.questions?.forEach((question) => {
        const savedAnswer = savedAnswers[question.id];
        if (savedAnswer !== undefined && savedAnswer === question.correctAnswer) {
          correct += 1;
        }
      });

      const totalMarks = totalQuestions * 4; // assume 4 marks per question
      const score = correct * 4;
      const percentage = totalMarks ? Math.round((score / totalMarks) * 100) : 0;

      // Update attempt with results
      await updateDoc(doc(db, 'attempts', attemptId), {
        status: 'completed',
        correctAnswers: correct,
        totalQuestions,
        totalMarks,
        score,
        percentage,
        timeSpentSec: Math.floor((new Date() - Date.parse(examStartTime)) / 1000) || 0,
        completedAt: serverTimestamp(),
        proctoringData: {
          violations: proctoringViolations,
          webcamEnabled,
          micEnabled,
          duration: examData.duration - timeRemaining,
          flagged: proctoringViolations.length > 3
        }
      });

      // Update user stats
      const user = auth.currentUser;
      if (user) {
        const userStatsDoc = doc(db, 'user_stats', user.uid);
        const userStatsSnapshot = await getDocFirebase(userStatsDoc);
        
        if (userStatsSnapshot.exists()) {
          const userData = userStatsSnapshot.data();
          const newTotalTests = (userData.totalTests || 0) + 1;
          const newCompletedTests = (userData.completedTests || 0) + 1;
          const newAverageScore = userData.completedTests 
            ? Math.round(((userData.averageScore * userData.completedTests) + percentage) / newCompletedTests)
            : percentage;
          
          await updateDoc(userStatsDoc, {
            totalTests: newTotalTests,
            completedTests: newCompletedTests,
            averageScore: newAverageScore,
            updatedAt: serverTimestamp(),
          });
        } else {
          // Create user stats if they don't exist
          await setDoc(userStatsDoc, {
            totalTests: 1,
            completedTests: 1,
            averageScore: percentage,
            totalTime: '0h 0m',
            streak: 1,
            rank: 0,
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Update quiz stats
      if (testId) {
        const quizDoc = doc(db, 'quizzes', testId);
        const quizSnapshot = await getDocFirebase(quizDoc);
        
        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.data();
          const newTotalAttempts = (quizData.stats?.totalAttempts || 0) + 1;
          const currentAvgScore = quizData.stats?.averageScore || 0;
          const newAvgScore = quizData.stats?.totalAttempts 
            ? Math.round(((currentAvgScore * quizData.stats.totalAttempts) + percentage) / newTotalAttempts)
            : percentage;
          
          await updateDoc(quizDoc, {
            'stats.totalAttempts': newTotalAttempts,
            'stats.averageScore': newAvgScore,
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Add to leaderboard by updating user stats
      if (user) {
        // Update user's stats for leaderboard
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDocFirebase(userDoc);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const newStats = {
            ...userData.stats,
            totalTestsTaken: (userData.stats?.totalTestsTaken || 0) + 1,
            averageScore: userData.stats?.totalTestsTaken 
              ? Math.round(((userData.stats.averageScore * userData.stats.totalTestsTaken) + percentage) / (userData.stats.totalTestsTaken + 1))
              : percentage,
            lastActive: serverTimestamp()
          };
          
          await updateDoc(userDoc, {
            stats: newStats,
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Navigate to results page, load from Firestore by attemptId
      navigate('/results-review', {
        state: {
          attemptId,
          testId,
        }
      });
    } catch (error) {
      console.error('Submission error:', error);
      throw new Error('Failed to submit exam. Please try again.');
    }
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Handle proctoring violations
  const handleViolationDetected = (violation) => {
    setProctoringViolations(prev => [...prev, violation]);
    
    // If too many violations, show warning
    if (proctoringViolations.length >= 5) {
      // In a real implementation, this might trigger an alert or notification
      console.warn('High violation count detected:', violation);
    }
  };

  const currentQuestion = examData?.questions?.[currentQuestionIndex];
  const answeredQuestions = new Set(answers.keys());

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-6 glass-card rounded-2xl">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Exam</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/student-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check if we have questions
  if (!examData?.questions || examData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-6 glass-card rounded-2xl">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No Questions Found</h2>
          <p className="text-muted-foreground mb-4">This exam doesn't have any questions. Please contact support.</p>
          <Button onClick={() => navigate('/student-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Additional check to ensure we have valid questions
  const validQuestions = examData.questions?.filter(q => q && q.text && Array.isArray(q.options) && q.options.length > 0) || [];
  console.log('Exam data questions count:', examData.questions?.length);
  console.log('Valid questions count:', validQuestions.length);
  console.log('Sample question structure:', examData.questions?.[0]);
  
  if (validQuestions.length === 0 && examData.questions?.length > 0) {
    console.warn('Questions exist but may have invalid structure');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Exam Header */}
      <ExamHeader
        examTitle={examData?.title}
        timeRemaining={timeRemaining}
        onSubmit={handleSubmit}
        onMinimize={handleFullscreenToggle}
        isFullscreen={isFullscreen}
        studentName={auth.currentUser?.displayName || 'Student'} // This should now work
        examId={examData?.id}
      />
      {/* Main Content */}
      <div className="pt-16 md:pt-24 h-screen flex">
        {/* Question Section */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          <div className="h-full">
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers?.get(currentQuestionIndex)}
              onAnswerSelect={handleAnswerSelect}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSaveAndNext={handleSaveAndNext}
              onMarkForReview={handleMarkForReview}
              isMarkedForReview={markedQuestions?.has(currentQuestionIndex)}
              canGoPrevious={currentQuestionIndex > 0}
              canGoNext={currentQuestionIndex < examData?.questions?.length - 1}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={examData?.questions?.length}
            />
          </div>
        </div>

        {/* Desktop Palette Sidebar */}
        <div className="hidden lg:block w-80 p-4 pr-6 overflow-hidden">
          <QuestionPalette
            questions={examData?.questions || []}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={answeredQuestions}
            markedQuestions={markedQuestions}
            visitedQuestions={visitedQuestions}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>

        {/* Proctoring Sidebar - restore original behavior */}
        <ProctoringSidebar
          isVisible={isProctoringSidebarOpen}
          onToggle={() => setIsProctoringSidebarOpen(!isProctoringSidebarOpen)}
          webcamEnabled={webcamEnabled}
          micEnabled={micEnabled}
          onViolationDetected={handleViolationDetected}
          examStartTime={examStartTimeRef.current}
          violations={proctoringViolations}
        />
      </div>
      {/* Mobile Palette Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <Button
          variant="default"
          size="lg"
          iconName="Grid3x3"
          onClick={() => setIsMobilePaletteOpen(true)}
          className="rounded-full w-14 h-14 shadow-elevation-3"
        >
          <span className="sr-only">Open Question Palette</span>
        </Button>
      </div>
      {/* Mobile Palette Modal */}
      <MobilePaletteModal
        isOpen={isMobilePaletteOpen}
        onClose={() => setIsMobilePaletteOpen(false)}
        questions={examData?.questions}
        currentQuestionIndex={currentQuestionIndex}
        answeredQuestions={answeredQuestions}
        markedQuestions={markedQuestions}
        visitedQuestions={visitedQuestions}
        onQuestionSelect={handleQuestionSelect}
      />
      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        examTitle={examData?.title}
        answeredCount={answeredQuestions?.size}
        totalQuestions={examData?.questions?.length}
        markedCount={markedQuestions?.size}
        timeRemaining={timeRemaining}
      />
    </div>
  );
};

export default ExamInterface;