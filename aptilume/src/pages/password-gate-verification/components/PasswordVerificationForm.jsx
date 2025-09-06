import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

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

  // Mock user data for verification
  const mockCredentials = {
    email: "student@aptilume.com",
    password: "SecurePass123!"
  };

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

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!password?.trim()) {
      return;
    }

    // Mock HMAC verification
    if (password === mockCredentials?.password) {
      onVerify?.(true);
    } else {
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
          <Icon 
            name={showPassword ? "EyeOff" : "Eye"} 
            size={18} 
          />
        </button>
      </div>
      {/* Delay Notice */}
      {isDelayed && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <p className="text-sm text-warning font-medium">
              Please wait {delayTime} seconds before trying again
            </p>
          </div>
        </div>
      )}
      {/* Mock Credentials Helper */}
      {attemptCount > 0 && (
        <div className="p-3 bg-muted/50 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs font-mono text-foreground">
            Password: {mockCredentials?.password}
          </p>
        </div>
      )}
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
          iconName="Shield"
          iconPosition="left"
          className="order-1 sm:order-2 flex-1"
        >
          {isLoading ? 'Verifying...' : 'Verify & Start Exam'}
        </Button>
      </div>
      {/* Security Indicators */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={14} className="text-success" />
          <span className="text-xs text-muted-foreground">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={14} className="text-success" />
          <span className="text-xs text-muted-foreground">HMAC Verified</span>
        </div>
      </div>
    </form>
  );
};

export default PasswordVerificationForm;