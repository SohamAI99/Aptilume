import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';

import QuestionCard from './components/QuestionCard';
import QuestionPalette from './components/QuestionPalette';
import ExamHeader from './components/ExamHeader';
import SubmitConfirmationModal from './components/SubmitConfirmationModal';
import MobilePaletteModal from './components/MobilePaletteModal';
import ProctoringSidebar from './components/ProctoringSidebar';

const ExamInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock exam data
  const mockExamData = {
    id: "EXAM_2025_001",
    title: "JEE Main Mock Test - Mathematics & Physics",
    duration: 10800, // 3 hours in seconds
    totalQuestions: 30,
    questions: [
      {
        id: 1,
        text: "If the roots of the equation x² - 3x + k = 0 are real and distinct, then the range of k is:",
        subject: "Mathematics",
        difficulty: "Medium",
        marks: 4,
        options: [
          { id: 'a', text: "k < 9/4" },
          { id: 'b', text: "k > 9/4" },
          { id: 'c', text: "k ≤ 9/4" },
          { id: 'd', text: "k ≥ 9/4" }
        ],
        correctAnswer: 'a',
        image: null,
        codeSnippet: null
      },
      {
        id: 2,
        text: "A particle moves in a straight line with constant acceleration. If it covers 20m in the first 2 seconds and 60m in the next 4 seconds, find the initial velocity:",
        subject: "Physics",
        difficulty: "Medium",
        marks: 4,
        options: [
          { id: 'a', text: "5 m/s" },
          { id: 'b', text: "10 m/s" },
          { id: 'c', text: "15 m/s" },
          { id: 'd', text: "20 m/s" }
        ],
        correctAnswer: 'a',
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
        codeSnippet: null
      },
      {
        id: 3,
        text: "What is the output of the following Python code?",
        subject: "Computer Science",
        difficulty: "Easy",
        marks: 2,
        options: [
          { id: 'a', text: "10" },
          { id: 'b', text: "15" },
          { id: 'c', text: "20" },
          { id: 'd', text: "Error" }
        ],
        correctAnswer: 'b',
        image: null,
        codeSnippet: `def calculate(x, y=5):
    return x + y

result = calculate(10)
print(result)`
      }
    ]
  };

  // Generate additional mock questions to reach 30 total
  const generateMockQuestions = () => {
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const additionalQuestions = [];

    for (let i = 4; i <= 30; i++) {
      const subject = subjects?.[Math.floor(Math.random() * subjects?.length)];
      const difficulty = difficulties?.[Math.floor(Math.random() * difficulties?.length)];
      
      additionalQuestions?.push({
        id: i,
        text: `Sample question ${i} for ${subject}. This is a ${difficulty?.toLowerCase()} level question that tests your understanding of key concepts in ${subject?.toLowerCase()}.`,
        subject,
        difficulty,
        marks: difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 4 : 6,
        options: [
          { id: 'a', text: `Option A for question ${i}` },
          { id: 'b', text: `Option B for question ${i}` },
          { id: 'c', text: `Option C for question ${i}` },
          { id: 'd', text: `Option D for question ${i}` }
        ],
        correctAnswer: ['a', 'b', 'c', 'd']?.[Math.floor(Math.random() * 4)],
        image: Math.random() > 0.7 ? `https://images.unsplash.com/photo-${1600000000000 + i}?w=400&h=200&fit=crop` : null,
        codeSnippet: subject === 'Computer Science' && Math.random() > 0.5 ? `// Sample code for question ${i}\nfunction example() {\n    return ${i};\n}` : null
      });
    }

    return [...mockExamData?.questions, ...additionalQuestions];
  };

  // State management
  const [examData, setExamData] = useState({
    ...mockExamData,
    questions: generateMockQuestions()
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(new Map());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  // Using Firestore test duration when available (seconds)
  const [timeRemaining, setTimeRemaining] = useState(examData?.duration);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isProctoringSidebarOpen, setIsProctoringSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examStartTime] = useState(new Date());

  // Mock student data
  const studentData = {
    name: "Arjun Sharma",
    email: "arjun.sharma@example.com",
    studentId: "STU2025001"
  };

  // Load test questions from Firestore if provided via navigation state
  useEffect(() => {
    (async () => {
      try {
        const navTestId = location?.state?.testId;
        if (!navTestId) return; // keep mock data
        const { db } = await import('../../utils/firebase');
        const { doc, getDoc, collection, getDocs, orderBy, query } = await import('firebase/firestore');

        // Load test doc for title/duration
        const snap = await getDoc(doc(db, 'tests', navTestId));
        let next = { ...mockExamData };
        if (snap.exists()) {
          const t = { id: snap.id, ...snap.data() };
          next = {
            id: t.id,
            title: t.title || next.title,
            duration: (t.duration || 60) * 60, // convert minutes -> seconds
            totalQuestions: t.questionCount || next.totalQuestions,
            questions: [],
          };
        }

        // Load questions subcollection
        const qs = query(collection(db, 'tests', navTestId, 'questions'), orderBy('id', 'asc'));
        const qSnap = await getDocs(qs);
        const questions = qSnap.docs.map(d => ({ ...d.data() }));
        if (questions.length) {
          next.questions = questions;
          next.totalQuestions = questions.length;
        }

        setExamData(next);
        setTimeRemaining(next.duration);
      } catch (e) {
        console.warn('Failed to load test from Firestore, using mock exam:', e?.message);
      }
    })();
  }, [location?.state?.testId]);

  // Timer effect
  useEffect(() => {
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
  }, []);

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
    if (currentAnswer) {
      console.log(`Saved answer for question ${currentQuestionIndex + 1}: ${currentAnswer}`);
    }
    handleNext();
  };

  const handleAnswerSelect = async (answerId) => {
    setAnswers(prev => new Map(prev.set(currentQuestionIndex, answerId)));

    // Persist answer to Firestore for resilience (resume support)
    try {
      const attemptId = location?.state?.attemptId || sessionStorage.getItem('currentAttemptId');
      if (attemptId) {
        const { db } = await import('../../utils/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
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

  const handleConfirmSubmit = async (password) => {
    try {
      // Persist attempt results to Firestore
      const { db } = await import('../../utils/firebase');
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');

      const attemptId = location?.state?.attemptId;
      const testId = location?.state?.testId;

      // Simple scoring: count correct by comparing selectedAnswer with mock correctAnswer
      let correct = 0;
      examData?.questions?.forEach((q, idx) => {
        const a = answers?.get(idx);
        if (a && a === q?.correctAnswer) correct += 1;
      });

      const totalQuestions = examData?.questions?.length || 0;
      const totalMarks = totalQuestions * 4; // assume 4 marks per question
      const score = correct * 4;
      const percentage = totalMarks ? Math.round((score / totalMarks) * 100) : 0;

      await updateDoc(doc(db, 'attempts', attemptId), {
        status: 'completed',
        correctAnswers: correct,
        totalQuestions,
        totalMarks,
        score,
        percentage,
        timeSpentSec: Math.floor((new Date() - Date.parse(examStartTime)) / 1000) || 0,
        completedAt: serverTimestamp(),
      });

      // Navigate to results page, load from Firestore by attemptId
      navigate('/results-review', {
        state: {
          attemptId,
          testId,
        }
      });
    } catch (error) {
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

  const currentQuestion = examData?.questions?.[currentQuestionIndex];
  const answeredQuestions = new Set(answers.keys());

  return (
    <div className="min-h-screen bg-background">
      {/* Exam Header */}
      <ExamHeader
        examTitle={examData?.title}
        timeRemaining={timeRemaining}
        onSubmit={handleSubmit}
        onMinimize={handleFullscreenToggle}
        isFullscreen={isFullscreen}
        studentName={studentData?.name}
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
            questions={examData?.questions}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={answeredQuestions}
            markedQuestions={markedQuestions}
            visitedQuestions={visitedQuestions}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>

        {/* Proctoring Sidebar */}
        <ProctoringSidebar
          isVisible={isProctoringSidebarOpen}
          onToggle={() => setIsProctoringSidebarOpen(!isProctoringSidebarOpen)}
          webcamEnabled={true}
          micEnabled={false}
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