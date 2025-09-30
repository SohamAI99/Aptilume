import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, Hash } from 'lucide-react';

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
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      setShowLoadingOverlay(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Hide loading overlay and show success
      setShowLoadingOverlay(false);
      setShowSuccess(true);
      
      // Redirect after success animation
      setTimeout(() => {
        navigate('/student-dashboard/results');
      }, 3000);
      
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit exam. Please try again.');
      setIsSubmitting(false);
      setShowLoadingOverlay(false);
    }
  };

  // Calculate progress
  const totalAnswered = examData?.answeredCount || 0;
  const totalMarked = examData?.markedCount || 0;
  const totalQuestions = examData?.totalQuestions || 0;
  const progressPercentage = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  if (showSuccess) {
    return <SuccessTransition examTitle={examData?.examTitle} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {showLoadingOverlay && <LoadingOverlay />}
      
      <div className="w-full max-w-2xl">
        <SecurityCard examTitle={examData?.examTitle} studentName={examData?.studentName} examId={examData?.examId}>
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-foreground">Progress Summary</h3>
                <span className="text-sm font-medium text-primary">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground">{totalAnswered}</div>
                  <div className="text-xs text-muted-foreground">Answered</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">{totalMarked}</div>
                  <div className="text-xs text-muted-foreground">Marked</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">{totalQuestions}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <p className="text-sm text-warning">
                <strong>Important:</strong> Once submitted, you cannot modify your answers. 
                Please verify your responses before proceeding.
              </p>
            </div>

            {/* Password Verification Form */}
            <PasswordVerificationForm
              password={password}
              onPasswordChange={handlePasswordChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          </div>
        </SecurityCard>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;