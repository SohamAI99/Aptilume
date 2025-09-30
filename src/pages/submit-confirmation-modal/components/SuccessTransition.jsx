import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessTransition = ({ examTitle }) => {
  return (
    <div className="fixed inset-0 z-60 bg-green-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-500 shadow-elevation-3">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2]?.map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <h2 className="text-2xl font-bold text-green-800">Exam Submitted Successfully!</h2>
          <p className="text-green-700">
            Your answers for "{examTitle}" have been securely submitted and are being processed.
          </p>
          <div className="pt-4">
            <p className="text-sm text-green-600">
              You will be redirected to your dashboard shortly...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessTransition;