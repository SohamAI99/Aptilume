import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const AuthFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 pt-6 border-t border-muted">
      <div className="text-center space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/landing-page')}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Home
        </Button>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <p className="flex items-center justify-center space-x-4">
            <span>Need help?</span>
            <button className="text-primary hover:text-primary/80 transition-colors">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFooter;