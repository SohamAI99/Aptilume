import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';

const ContextualActionBar = ({ 
  examState, 
  onExitExam, 
  onSubmitTest, 
  className = '' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getContextualActions = () => {
    switch (location?.pathname) {
      case '/quiz-rules-instructions':
        return (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/student-dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              onClick={() => navigate('/password-gate-verification')}
            >
              Continue to Exam
            </Button>
          </div>
        );

      case '/password-gate-verification':
        return (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/quiz-rules-instructions')}
            >
              Back to Instructions
            </Button>
          </div>
        );

      case '/exam-interface':
        return (
          <div className="flex items-center space-x-3">
            {examState?.canSubmit && (
              <Button
                variant="success"
                size="sm"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={() => {
                  if (window.confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
                    onSubmitTest?.();
                  }
                }}
              >
                Submit Test
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              iconName="AlertTriangle"
              iconPosition="left"
              onClick={() => {
                if (window.confirm('Are you sure you want to exit the exam? Your progress will be lost.')) {
                  onExitExam?.();
                  navigate('/student-dashboard');
                }
              }}
            >
              Exit Exam
            </Button>
          </div>
        );

      case '/student-dashboard':
        return (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={() => window.location?.reload()}
            >
              Refresh
            </Button>
          </div>
        );

      case '/authentication-login-register':
        return (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/landing-page')}
            >
              Back to Home
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const actions = getContextualActions();

  if (!actions) return null;

  return (
    <div className={`flex items-center ${className}`}>
      {actions}
    </div>
  );
};

export default ContextualActionBar;