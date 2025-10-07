import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;