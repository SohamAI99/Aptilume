import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../utils/firebase'; // Import auth directly
import { reauthenticateWithCredential, EmailAuthProvider } from '../../../utils/firebase'; // Import Firebase auth functions directly
import Input from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Eye, EyeOff, Clock, Shield, Lock } from 'lucide-react';

const PasswordVerificationForm = ({ 
  onVerify, 
  isLoading = false, 
  error = '', 
  attemptCount = 0 
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const [delayTime, setDelayTime] = useState(0);
  const navigate = useNavigate();

  // Handle progressive delay for failed attempts
  useEffect(() => {
    if (attemptCount > 2) {
      const delay = Math.min(attemptCount * 5, 30); // Max 30 seconds
      setDelayTime(delay);
      setIsDelayed(true);
      
      const timer = setInterval(() => {
        setDelayTime(prev => {
          if (prev <= 1) {
            setIsDelayed(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [attemptCount]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!password?.trim()) {
      return;
    }

    try {
      // Re-authenticate user with provided password
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No user found');
      }
      
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      // Password verification successful
      onVerify?.(true);
    } catch (err) {
      console.error('Password verification failed:', err);
      // Password verification failed
      onVerify?.(false);
    }
  };

  const handleCancel = () => {
    navigate('/quiz-rules-instructions');
  };

  const isFormValid = password?.trim()?.length >= 6;
  const canSubmit = isFormValid && !isLoading && !isDelayed;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Password Input */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          label="Enter Your Password"
          placeholder="Enter your login password"
          value={password}
          onChange={(e) => setPassword(e?.target?.value)}
          error={error}
          required
          disabled={isLoading || isDelayed}
          className="pr-12"
        />
        
        {/* Password Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors focus-ring rounded p-1"
          disabled={isLoading || isDelayed}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {/* Delay Notice */}
      {isDelayed && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-warning" />
            <p className="text-sm text-warning font-medium">
              Please wait {delayTime} seconds before trying again
            </p>
          </div>
        </div>
      )}
      {/* Security Notice */}
      <div className="p-3 bg-muted/50 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground">
          For security, please re-enter your login password to start the exam.
        </p>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="order-2 sm:order-1"
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="default"
          disabled={!canSubmit}
          loading={isLoading}
          icon={<Shield className="h-4 w-4" />}
          iconPosition="left"
          className="order-1 sm:order-2 flex-1"
        >
          {isLoading ? 'Verifying...' : 'Verify & Start Exam'}
        </Button>
      </div>
      {/* Security Indicators */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Shield className="h-3.5 w-3.5 text-success" />
          <span className="text-xs text-muted-foreground">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="h-3.5 w-3.5 text-success" />
          <span className="text-xs text-muted-foreground">Password Verified</span>
        </div>
      </div>
    </form>
  );
};

export default PasswordVerificationForm;