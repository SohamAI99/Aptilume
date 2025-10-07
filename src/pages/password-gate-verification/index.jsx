import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import SecurityCard from './components/SecurityCard';
import PasswordVerificationForm from './components/PasswordVerificationForm';
import LoadingOverlay from './components/LoadingOverlay';
import SuccessTransition from './components/SuccessTransition';
import Icon from '../../components/AppIcon';

const PasswordGateVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load current user from Firebase Auth
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      const { auth } = await import('../../utils/firebase');
      setUser({
        name: auth.currentUser?.displayName || 'Student',
        email: auth.currentUser?.email || 'student@example.com',
        studentId: auth.currentUser?.uid?.slice(0, 8) || '—'
      });
    })();
  }, []);

  // Check if user came from quiz rules page
  useEffect(() => {
    const fromRules = location?.state?.fromRules;
    if (!fromRules) {
      // Redirect to quiz rules if not coming from there
      navigate('/quiz-rules-instructions', { 
        replace: true,
        state: { 
          message: 'Please read and accept the exam rules first.',
          type: 'info'
        }
      });
    }
  }, [location?.state, navigate]);

  const handlePasswordVerification = async (isValid) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate HMAC verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isValid) {
        setShowSuccess(true);
        // Create attempt in Firestore and navigate to exam interface
        const { db } = await import('../../utils/firebase');
        const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
        const { auth } = await import('../../utils/firebase');
        const testId = location?.state?.testId;
        
        // Get test data from session storage
        const currentTest = JSON.parse(sessionStorage.getItem('currentTest') || '{}');
        const testTitle = currentTest?.title || 'Mock Quiz';
        
        const attemptRef = await addDoc(collection(db, 'attempts'), {
          userId: auth.currentUser?.uid,
          testId,
          testTitle: testTitle,
          status: 'in_progress',
          startedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });

        // Persist attempt ID for guard/resume
        sessionStorage.setItem('currentAttemptId', attemptRef.id);

        // Small delay for success animation, then navigate
        setTimeout(() => {
          navigate('/exam-interface', { state: { attemptId: attemptRef.id, testId } });
        }, 800);
      } else {
        setAttemptCount(prev => prev + 1);
        setError('Incorrect password. Please try again.');
        
        if (attemptCount >= 4) {
          setError('Too many failed attempts. Please contact support if you continue to have issues.');
        }
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/authentication-login-register');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader 
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="pt-16 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* AptiLume Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <img src="/logo.png" alt="AptiLume" className="h-8 w-8 object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">AptiLume</h2>
            <p className="text-muted-foreground text-sm mt-1">Secure Exam Platform</p>
          </div>

          {/* Security Card */}
          <SecurityCard>
            <PasswordVerificationForm
              onVerify={handlePasswordVerification}
              isLoading={isLoading}
              error={error}
              attemptCount={attemptCount}
            />
          </SecurityCard>

          {/* Additional Security Info */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Session: 2 hours</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={12} />
                <span>Proctored</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} />
                <span>Secure</span>
              </div>
            </div>
          </div>

          {/* Exam Details */}
          <div className="mt-8 glass-card rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Icon name="FileText" size={18} className="mr-2" />
              Exam Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <span className="text-foreground font-medium">Quantitative Aptitude</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span className="text-foreground font-medium">50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground font-medium">120 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="text-foreground font-medium">Intermediate</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isLoading}
        message="Performing HMAC verification..."
      />

      {/* Success Transition */}
      <SuccessTransition 
        isVisible={showSuccess}
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default PasswordGateVerification;