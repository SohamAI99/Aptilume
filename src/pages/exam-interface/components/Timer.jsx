import React from 'react';
import { Timer } from 'lucide-react';

const TimerComponent = ({ timeRemaining }) => {
  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-destructive'; // Last 5 minutes
    if (timeRemaining <= 900) return 'text-warning'; // Last 15 minutes
    return 'text-foreground';
  };

  const getTimeBackground = () => {
    if (timeRemaining <= 300) return 'bg-destructive/10 border-destructive/20';
    if (timeRemaining <= 900) return 'bg-warning/10 border-warning/20';
    return 'bg-muted border-border';
  };

  return (
    <div className={`px-4 py-2 rounded-lg border-2 ${getTimeBackground()}`}>
      <div className="flex items-center space-x-2">
        <Timer 
          className={`h-5 w-5 ${timeRemaining <= 300 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} 
        />
        <div className="text-center">
          <div className={`text-xl font-mono font-bold ${getTimeColor()}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs text-muted-foreground">Time Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default TimerComponent;