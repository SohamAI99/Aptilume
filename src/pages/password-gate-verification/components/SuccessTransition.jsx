import React, { useEffect } from 'react';
import { CheckCircle, Loader } from 'lucide-react';

const SuccessTransition = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      // Set a flag in sessionStorage to indicate that fullscreen should be enabled
      sessionStorage.setItem('examFullscreenRequired', 'true');
      
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Verification Successful</h2>
        <p className="text-muted-foreground mb-4">Initializing secure exam environment...</p>
        <div className="flex items-center justify-center space-x-2">
          <Loader className="h-5 w-5 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Preparing proctoring system</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessTransition;