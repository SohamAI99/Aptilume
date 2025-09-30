import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { User, Clock, Timer, Minimize2, Maximize2, CheckCircle, AlertTriangle, X, Eye } from 'lucide-react';

const ExamHeader = ({ 
  examTitle, 
  timeRemaining, 
  onSubmit, 
  onMinimize,
  isFullscreen = false,
  studentName,
  examId
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo & Exam Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AL</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{examTitle}</h1>
              <p className="text-xs text-muted-foreground">ID: {examId}</p>
            </div>
          </div>
          
          <div className="hidden md:block h-8 w-px bg-border"></div>
          
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{studentName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {currentTime?.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Timer */}
        <div className="flex items-center">
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
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Proctoring Toggle - Always visible during exam */}
          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="h-4 w-4" />}
            className="hidden md:flex"
          >
            Proctoring
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            onClick={onMinimize}
            className="hidden md:flex"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>

          {/* Submit Button */}
          <Button
            variant="success"
            size="sm"
            icon={<CheckCircle className="h-4 w-4" />}
            iconPosition="left"
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Test
          </Button>

          {/* Emergency Exit */}
          <Button
            variant="destructive"
            size="sm"
            icon={<AlertTriangle className="h-4 w-4" />}
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the exam? Your progress will be lost.')) {
                window.location.href = '/student-dashboard';
              }
            }}
            className="hidden sm:flex"
          >
            Exit
          </Button>
        </div>
      </div>
      {/* Mobile Info Bar */}
      <div className="md:hidden px-6 py-2 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <span className="text-foreground font-medium">{studentName}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{currentTime?.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="xs"
              icon={<Eye className="h-3 w-3" />}
            />
            <Button
              variant="ghost"
              size="xs"
              icon={<Maximize2 className="h-3 w-3" />}
              onClick={onMinimize}
            />
            <Button
              variant="destructive"
              size="xs"
              icon={<X className="h-3 w-3" />}
              onClick={() => {
                if (window.confirm('Exit exam?')) {
                  window.location.href = '/student-dashboard';
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;