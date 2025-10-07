import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, query, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import AppHeader from '../../components/ui/AppHeader';
import QuestionCard from './components/QuestionCard';
import Timer from './components/Timer';
import ProgressBar from './components/ProgressBar';
import NavigationControls from './components/NavigationControls';
import SubmitConfirmationModal from '../../submit-confirmation-modal/components/SubmitConfirmationModal';
import FullscreenMonitor from './components/FullscreenMonitor';
import Icon from '../../components/AppIcon';

const ExamInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [user, setUser] = useState(null);
  const [violations, setViolations] = useState([]);
  const [showProctoringInfo, setShowProctoringInfo] = useState(true); // Toggle state

  // Load current user
  useEffect(() => {
    (async () => {
      const { auth } = await import('../../utils/firebase');
      setUser({
        name: auth.currentUser?.displayName || 'Student',
        email: auth.currentUser?.email || 'student@example.com'
      });
    })();
  }, []);

  // Check if fullscreen is required and enable it
  useEffect(() => {
    const examFullscreenRequired = sessionStorage.getItem('examFullscreenRequired');
    console.log('Checking fullscreen requirement:', examFullscreenRequired);
    if (examFullscreenRequired === 'true') {
      // The FullscreenMonitor component will handle entering fullscreen
      console.log('Fullscreen required for exam');
    }
  }, []);

  // Load exam data
  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);
        const attemptId = location?.state?.attemptId;
        const testId = location?.state?.testId;
        
        if (!attemptId || !testId) {
          throw new Error('Missing attempt or test ID');
        }

        // Load attempt data to get test reference
        const attemptDoc = await getDoc(doc(db, 'attempts', attemptId));
        if (!attemptDoc.exists()) {
          throw new Error('Attempt not found');
        }

        const attemptData = attemptDoc.data();
        
        // Try to load test data from Firestore first
        let testData = null;
        try {
          const testDoc = await getDoc(doc(db, 'quizzes', testId));
          if (testDoc.exists()) {
            testData = testDoc.data();
          }
        } catch (testError) {
          console.warn('Could not load test from Firestore:', testError);
        }
        
        // If no test data in Firestore, use mock data
        if (!testData) {
          // Get test data from session storage
          const currentTest = JSON.parse(sessionStorage.getItem('currentTest') || '{}');
          
          // Create mock test data
          testData = {
            title: currentTest?.title || 'Mock Quiz',
            duration: currentTest?.duration || 30, // minutes
            description: currentTest?.description || 'This is a mock quiz for demonstration purposes.'
          };
        }
        
        // Load questions - try Firestore first, then mock questions
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
        }

        // If no questions from Firestore, create mock questions
        if (questions.length === 0) {
          console.log('Creating mock questions');
          questions = createMockQuestions();
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

  // Create mock questions for demonstration
  const createMockQuestions = () => {
    return [
      {
        id: 'q1',
        text: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris is the capital of France.',
        difficulty: 'Easy',
        category: 'Geography',
        marks: 1
      },
      {
        id: 'q2',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: '2 + 2 = 4.',
        difficulty: 'Easy',
        category: 'Mathematics',
        marks: 1
      },
      {
        id: 'q3',
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        explanation: 'Mars is known as the Red Planet due to iron oxide on its surface.',
        difficulty: 'Medium',
        category: 'Science',
        marks: 1
      },
      {
        id: 'q4',
        text: 'What is the largest mammal in the world?',
        options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
        correctAnswer: 1,
        explanation: 'The Blue Whale is the largest mammal and the largest animal ever known to have lived on Earth.',
        difficulty: 'Medium',
        category: 'Biology',
        marks: 1
      },
      {
        id: 'q5',
        text: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
        explanation: 'World War II ended in 1945.',
        difficulty: 'Hard',
        category: 'History',
        marks: 1
      }
    ];
  };

  // Timer effect
  useEffect(() => {
    if (loading || examData?.duration === 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, examData?.duration]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNavigate = (direction) => {
    if (direction === 'next' && currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      // Calculate score
      let correctAnswers = 0;
      examData.questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / examData.questions.length) * 100);
      
      // Update attempt with results
      const attemptId = location?.state?.attemptId;
      if (attemptId) {
        await updateDoc(doc(db, 'attempts', attemptId), {
          answers: answers,
          score: score,
          correctAnswers: correctAnswers,
          totalQuestions: examData.questions.length,
          completedAt: serverTimestamp(),
          status: 'completed',
          updatedAt: serverTimestamp(),
          violations: violations // Save violations to attempt
        });
      }
      
      // Clear the fullscreen requirement flag
      sessionStorage.removeItem('examFullscreenRequired');
      
      // Navigate to results page
      navigate('/results-review', { 
        state: { 
          attemptId,
          score,
          correctAnswers,
          totalQuestions: examData.questions.length,
          timeTaken: examData.duration - timeRemaining,
          violations: violations // Pass violations to results page
        } 
      });
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError('Failed to submit exam. Please try again.');
    }
  };

  const handleViolation = (violation) => {
    setViolations(prev => [...prev, violation]);
  };

  const handleLogout = () => {
    navigate('/authentication-login-register');
  };

  // Toggle between proctoring info and question blocks view
  const handleToggleView = () => {
    setShowProctoringInfo(!showProctoringInfo);
  };

  // Render question blocks view
  const renderQuestionBlocks = () => {
    if (!examData?.questions) return null;

    return (
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-96 overflow-y-auto">
        {examData.questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
              currentQuestionIndex === index
                ? 'bg-primary text-white shadow-lg'
                : answers[question.id] !== undefined
                ? 'bg-success/20 text-success border border-success'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  // Render proctoring info view
  const renderProctoringInfo = () => {
    return (
      <div className="space-y-4">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <h3 className="font-semibold text-warning mb-2">Proctoring Active</h3>
          <p className="text-sm text-warning">
            Your exam is being monitored. Please remain in fullscreen mode throughout the exam.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Violations</div>
            <div className="text-lg font-semibold text-foreground">{violations.length}/3</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Time Remaining</div>
            <div className="text-lg font-semibold text-foreground">
              {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Loader" size={32} className="animate-spin text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Exam</h2>
          <p className="text-muted-foreground">Preparing your test questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Exam</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No Exam Data</h2>
          <p className="text-muted-foreground">Exam data could not be loaded.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Fullscreen Monitor */}
      <div>{console.log('Rendering FullscreenMonitor component')}</div>
      <FullscreenMonitor 
        onViolationDetected={handleViolation}
        onSubmitExam={handleSubmitExam}
        showProctoringInfo={showProctoringInfo}
        onToggleView={handleToggleView}
      />
      
      {/* Header */}
      <AppHeader user={user} onLogout={handleLogout} />
      
      {/* Main Content */}
      <main className="pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Exam Header */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{examData.title}</h1>
                <p className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {examData.questions.length}
                </p>
              </div>
              <Timer timeRemaining={timeRemaining} />
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <ProgressBar progress={progress} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Card - Main Content */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 mb-6">
                <QuestionCard
                  question={currentQuestion}
                  selectedAnswer={answers[currentQuestion.id]}
                  onAnswerSelect={(optionIndex) => handleAnswerSelect(currentQuestion.id, optionIndex)}
                />
              </div>

              {/* Navigation Controls */}
              <NavigationControls
                currentIndex={currentQuestionIndex}
                totalQuestions={examData.questions.length}
                onNavigate={handleNavigate}
                onSubmit={() => setShowSubmitModal(true)}
              />
            </div>

            {/* Sidebar - Toggle between Proctoring Info and Question Blocks */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {showProctoringInfo ? 'Proctoring Info' : 'Question Blocks'}
                  </h2>
                </div>
                
                {showProctoringInfo ? renderProctoringInfo() : renderQuestionBlocks()}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmitExam}
        answeredQuestions={Object.keys(answers).length}
        totalQuestions={examData.questions.length}
      />
    </div>
  );
};

export default ExamInterface;