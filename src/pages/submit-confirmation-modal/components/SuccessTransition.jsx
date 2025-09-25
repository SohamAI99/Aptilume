import React from 'react';
import Icon from '../../../components/AppIcon';

const SuccessTransition = ({ examTitle }) => {
  return (
    <div className="fixed inset-0 z-60 bg-green-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-500 shadow-elevation-3">
            <Icon name="CheckCircle" size={40} className="text-white" />
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
          <p className="text-green-700 text-lg">{examTitle}</p>
          <div className="p-4 bg-white/80 rounded-lg border border-green-200">
            <div className="space-y-2 text-sm text-green-600">
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Shield" size={16} />
                <span>Your answers are securely saved</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>Results are being processed</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Mail" size={16} />
                <span>Email notification will be sent</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-green-600">
            Redirecting to results page...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
            <div className="bg-green-500 h-2 rounded-full animate-[progress_3s_ease-out_forwards] origin-left" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessTransition;