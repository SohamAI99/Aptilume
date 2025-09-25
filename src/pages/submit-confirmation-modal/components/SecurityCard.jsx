import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityCard = ({ examTitle, studentName, examId }) => {
  return (
    <div className="p-6 border-b border-border bg-primary/10">
      <div className="flex items-center space-x-4">
        {/* AptiLume Logo */}
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
          <Icon name="Shield" size={24} className="text-white" />
        </div>
        
        {/* Exam Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-lg font-semibold text-foreground">Security Verification</h2>
            <Icon name="Lock" size={16} className="text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{examTitle}</p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Icon name="User" size={12} className="mr-1" />
              {studentName}
            </span>
            <span className="flex items-center">
              <Icon name="Hash" size={12} className="mr-1" />
              {examId}
            </span>
          </div>
        </div>

        {/* Security Status */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1 text-green-600 mb-1">
            <Icon name="CheckCircle" size={16} />
            <span className="text-xs font-medium">Secure Session</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date()?.toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;