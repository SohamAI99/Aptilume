import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-elevation-3 text-center max-w-sm mx-4">
        <div className="mb-4">
          <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Processing Submission</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your exam is being submitted securely. Please do not close this window.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Shield" size={14} className="text-green-500" />
            <span>Encrypting answers...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Database" size={14} className="text-blue-500" />
            <span>Saving to secure servers...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-primary" />
            <span>Generating results...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;