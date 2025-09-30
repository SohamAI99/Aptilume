import React from 'react';
import { Shield, Lock, User, Hash } from 'lucide-react';

const SecurityCard = ({ examTitle, studentName, examId, children }) => {
  return (
    <div className="glass-card rounded-2xl p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        {/* Security Header */}
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

      {/* Exam Info Footer */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Exam</span>
            <span className="text-sm text-muted-foreground">{examTitle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Student</span>
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{studentName}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">ID</span>
            <div className="flex items-center space-x-1">
              <Hash className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{examId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
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