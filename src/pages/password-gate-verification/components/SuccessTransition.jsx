import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SuccessTransition = ({ isVisible, onComplete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.();
        navigate('/exam-interface');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, navigate]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass-card rounded-2xl p-8 max-w-sm mx-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-2">
            Verification Successful!
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Redirecting to exam interface...
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessTransition;