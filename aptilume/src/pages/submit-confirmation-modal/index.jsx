import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


import Icon from '../../components/AppIcon';
import SecurityCard from './components/SecurityCard';
import PasswordVerificationForm from './components/PasswordVerificationForm';
import LoadingOverlay from './components/LoadingOverlay';
import SuccessTransition from './components/SuccessTransition';

const SubmitConfirmationModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get exam data from location state or use mock data
  const examData = location?.state || {
    examId: "EXAM_2025_001",
    examTitle: "JEE Main Mock Test - Mathematics & Physics", 
    totalQuestions: 30,
    answeredCount: 28,
    markedCount: 3,
    timeRemaining: 1800, // 30 minutes
    studentName: "Arjun Sharma"
  };

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  // Prevent navigation during submission
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isSubmitting) {
        e?.preventDefault();
        e.returnValue = 'Exam submission is in progress. Please wait.';
        return e?.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting]);

  // Handle escape key for accessibility
  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape' && !isSubmitting && !showSuccess) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSubmitting, showSuccess]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!password?.trim()) {
      setError('Password is required to submit the exam');
      return;
    }

    setIsSubmitting(true);
    setShowLoadingOverlay(true);
    setError('');

    try {
      // Mock password verification - in real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (password !== 'student123') {
        throw new Error('Incorrect password. Please enter your login password.');
      }

      // Mock submission process
      await new Promise(resolve => setTimeout(resolve, 2000));

      setShowSuccess(true);
      
      // Redirect after success animation
      setTimeout(() => {
        navigate('/results-review', {
          state: {
            examId: examData?.examId,
            examTitle: examData?.examTitle,
            totalQuestions: examData?.totalQuestions,
            answeredQuestions: examData?.answeredCount,
            submissionTime: new Date(),
            score: 85,
            grade: 'A',
            timeSpent: 9000, // 2.5 hours
            results: generateMockResults()
          }
        });
      }, 3000);

    } catch (err) {
      setError(err?.message || 'Failed to submit exam. Please try again.');
      setShowLoadingOverlay(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMockResults = () => {
    return {
      overall: {
        score: 85,
        percentage: 85,
        grade: 'A',
        rank: 142,
        totalCandidates: 15000
      },
      subjects: [
        { name: 'Mathematics', score: 32, total: 40, percentage: 80 },
        { name: 'Physics', score: 36, total: 40, percentage: 90 },
        { name: 'Chemistry', score: 30, total: 40, percentage: 75 }
      ],
      questions: Array.from({ length: examData?.totalQuestions }, (_, i) => ({
        id: i + 1,
        subject: ['Mathematics', 'Physics', 'Chemistry']?.[Math.floor(i / 10)],
        question: `Sample question ${i + 1} content...`,
        selectedAnswer: 'B',
        correctAnswer: Math.random() > 0.3 ? 'B' : 'A',
        isCorrect: Math.random() > 0.3,
        explanation: `Detailed explanation for question ${i + 1}...`,
        difficulty: ['Easy', 'Medium', 'Hard']?.[Math.floor(Math.random() * 3)]
      }))
    };
  };

  const handleCancel = () => {
    navigate('/exam-interface', { 
      replace: true,
      state: { returnFromSubmission: true }
    });
  };

  if (showSuccess) {
    return <SuccessTransition examTitle={examData?.examTitle} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm">
      {showLoadingOverlay && <LoadingOverlay />}
      <div className="relative bg-white rounded-lg shadow-elevation-3 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Security Card Header */}
        <SecurityCard 
          examTitle={examData?.examTitle}
          studentName={examData?.studentName}
          examId={examData?.examId}
        />

        {/* Exam Summary */}
        <div className="px-6 pb-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="BarChart3" size={18} className="mr-2 text-primary" />
              Submission Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Questions:</span>
                <span className="font-medium text-foreground">{examData?.totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Answered:</span>
                <span className="font-medium text-green-600">{examData?.answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Unanswered:</span>
                <span className="font-medium text-orange-600">{examData?.totalQuestions - examData?.answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Marked:</span>
                <span className="font-medium text-purple-600">{examData?.markedCount}</span>
              </div>
              <div className="flex items-center justify-between col-span-2">
                <span className="text-muted-foreground">Time Remaining:</span>
                <span className="font-medium text-foreground font-mono">{formatTime(examData?.timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="px-6 pb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">Final Submission Warning</p>
                <p className="text-sm text-red-700">
                  Once submitted, you cannot return to the exam or modify your answers. 
                  Please ensure you have reviewed all questions before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Verification Form */}
        <div className="px-6 pb-6">
          <PasswordVerificationForm
            password={password}
            onPasswordChange={(value) => {
              setPassword(value);
              setError('');
            }}
            error={error}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;