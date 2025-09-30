import React from 'react';
import { Loader2, Shield, Database, CheckCircle } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-elevation-3 text-center max-w-sm mx-4">
        <div className="mb-4">
          <Loader2 className="mx-auto text-primary animate-spin h-12 w-12" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Processing Submission</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your exam is being submitted securely. Please do not close this window.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="text-green-500 h-4 w-4" />
            <span>Encrypting answers...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Database className="text-blue-500 h-4 w-4" />
            <span>Saving to secure servers...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="text-primary h-4 w-4" />
            <span>Generating results...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;