import React from 'react';
import { Shield, Lock } from 'lucide-react';

const SecurityCard = ({ children, className = '' }) => {
  return (
    <div className={`glass-card rounded-2xl p-8 w-full max-w-md mx-auto ${className}`}>
      {/* Security Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Security Verification
        </h1>
        <p className="text-muted-foreground text-sm">
          Please re-enter your password to access the exam
        </p>
      </div>

      {children}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start space-x-3">
          <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Why is this required?
            </p>
            <p className="text-xs text-muted-foreground">
              This additional verification ensures exam integrity and prevents unauthorized access to test content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;