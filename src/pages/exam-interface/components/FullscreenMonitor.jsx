import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Eye, Grid3X3 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const FullscreenMonitor = ({ onViolationDetected, onSubmitExam, showProctoringInfo = true, onToggleView }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const fullscreenCheckRef = useRef(null);
  const [fullscreenSupported, setFullscreenSupported] = useState(true);

  // Function to check if video is in fullscreen (as requested)
  const isVideoInFullscreen = () => {
    if (document.fullscreenElement?.nodeName === "VIDEO") {
      return true;
    }
    return false;
  };

  // Check if browser supports fullscreen API
  const getFullscreenAPI = () => {
    if (document.fullscreenEnabled) {
      return {
        element: () => document.fullscreenElement,
        request: (el) => el.requestFullscreen(),
        exit: () => document.exitFullscreen(),
        event: 'fullscreenchange',
        error: 'fullscreenerror'
      };
    } else if (document.webkitFullscreenEnabled) {
      return {
        element: () => document.webkitFullscreenElement,
        request: (el) => el.webkitRequestFullscreen(),
        exit: () => document.webkitExitFullscreen(),
        event: 'webkitfullscreenchange',
        error: 'webkitfullscreenerror'
      };
    } else if (document.mozFullScreenEnabled) {
      return {
        element: () => document.mozFullScreenElement,
        request: (el) => el.mozRequestFullScreen(),
        exit: () => document.mozCancelFullScreen(),
        event: 'mozfullscreenchange',
        error: 'mozfullscreenerror'
      };
    } else if (document.msFullscreenEnabled) {
      return {
        element: () => document.msFullscreenElement,
        request: (el) => el.msRequestFullscreen(),
        exit: () => document.msExitFullscreen(),
        event: 'MSFullscreenChange',
        error: 'MSFullscreenError'
      };
    }
    return null;
  };

  // Enter fullscreen mode
  const enterFullscreen = () => {
    const fullscreenAPI = getFullscreenAPI();
    if (!fullscreenAPI) {
      console.warn('Fullscreen API not supported');
      setFullscreenSupported(false);
      return;
    }

    const element = document.documentElement;
    try {
      console.log('Attempting to enter fullscreen mode');
      fullscreenAPI.request(element);
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      setFullscreenSupported(false);
    }
  };

  // Check fullscreen status
  const checkFullscreenStatus = () => {
    // First check if a video is in fullscreen (as requested)
    if (isVideoInFullscreen()) {
      console.log('Video is in fullscreen mode');
      return true;
    }
    
    const fullscreenAPI = getFullscreenAPI();
    if (!fullscreenAPI) return false;
    
    const isFullscreen = !!fullscreenAPI.element();
    console.log('Fullscreen status:', isFullscreen);
    return isFullscreen;
  };

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    const fullscreenStatus = checkFullscreenStatus();
    const prevFullscreenStatus = isFullscreen;
    setIsFullscreen(fullscreenStatus);
    
    console.log('Fullscreen change detected:', { prevFullscreenStatus, fullscreenStatus });
    
    // If exiting fullscreen (and it's not a video fullscreen), show warning
    if (prevFullscreenStatus && !fullscreenStatus && !isVideoInFullscreen() && violationCount < 3) {
      const newViolationCount = violationCount + 1;
      console.log('Fullscreen violation detected:', newViolationCount);
      setViolationCount(newViolationCount);
      setWarningMessage(`Fullscreen violation detected. Warning ${newViolationCount} of 3.`);
      setShowWarning(true);
      
      // Call violation callback
      if (onViolationDetected) {
        onViolationDetected({
          type: 'FULLSCREEN_EXIT',
          description: `User exited fullscreen mode. Violation ${newViolationCount} of 3.`,
          timestamp: new Date().toISOString()
        });
      }
      
      // If this is the third violation, auto-submit
      if (newViolationCount >= 3) {
        console.log('Maximum violations reached, auto-submitting exam');
        setTimeout(() => {
          if (onSubmitExam) {
            onSubmitExam();
          }
        }, 3000);
      }
    }
  };

  // Handle fullscreen error
  const handleFullscreenError = (event) => {
    console.error('Fullscreen error:', event);
    setFullscreenSupported(false);
  };

  // Initialize fullscreen monitoring
  useEffect(() => {
    console.log('Initializing fullscreen monitor');
    const fullscreenAPI = getFullscreenAPI();
    if (!fullscreenAPI) {
      console.warn('Fullscreen API not supported');
      setFullscreenSupported(false);
      // Even if fullscreen is not supported, we still want to monitor tab switching
      return;
    }

    // Enter fullscreen when component mounts
    enterFullscreen();

    // Add event listeners
    document.addEventListener(fullscreenAPI.event, handleFullscreenChange);
    document.addEventListener(fullscreenAPI.error, handleFullscreenError);

    // Periodic fullscreen check
    fullscreenCheckRef.current = setInterval(() => {
      const fullscreenStatus = checkFullscreenStatus();
      if (isFullscreen !== fullscreenStatus) {
        console.log('Periodic fullscreen check detected change');
        handleFullscreenChange();
      }
    }, 1000);

    return () => {
      console.log('Cleaning up fullscreen monitor');
      // Clean up
      document.removeEventListener(fullscreenAPI.event, handleFullscreenChange);
      document.removeEventListener(fullscreenAPI.error, handleFullscreenError);
      
      if (fullscreenCheckRef.current) {
        clearInterval(fullscreenCheckRef.current);
      }
      
      // Exit fullscreen when component unmounts
      const fullscreenAPI = getFullscreenAPI();
      if (fullscreenAPI && fullscreenAPI.element()) {
        try {
          fullscreenAPI.exit();
        } catch (error) {
          console.error('Error exiting fullscreen:', error);
        }
      }
    };
  }, []); // Empty dependency array to run only on mount

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('Visibility change detected:', document.hidden);
      if (document.hidden && violationCount < 3) {
        const newViolationCount = violationCount + 1;
        console.log('Tab switching violation detected:', newViolationCount);
        setViolationCount(newViolationCount);
        setWarningMessage(`Tab switching detected. Warning ${newViolationCount} of 3.`);
        setShowWarning(true);
        
        // Call violation callback
        if (onViolationDetected) {
          onViolationDetected({
            type: 'TAB_SWITCH',
            description: `User switched to another tab. Violation ${newViolationCount} of 3.`,
            timestamp: new Date().toISOString()
          });
        }
        
        // If this is the third violation, auto-submit
        if (newViolationCount >= 3) {
          console.log('Maximum violations reached, auto-submitting exam');
          setTimeout(() => {
            if (onSubmitExam) {
              onSubmitExam();
            }
          }, 3000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [violationCount, onViolationDetected, onSubmitExam]);

  // Show a warning if fullscreen is not supported
  useEffect(() => {
    if (!fullscreenSupported) {
      console.log('Fullscreen not supported, showing fallback warning');
      const timer = setTimeout(() => {
        setWarningMessage('Fullscreen mode is not supported in your browser. Please use a modern browser for the best experience.');
        setShowWarning(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [fullscreenSupported]);

  const closeWarning = () => {
    console.log('Closing warning modal');
    setShowWarning(false);
  };

  // Function to simulate a fullscreen violation for testing
  const simulateFullscreenViolation = () => {
    if (violationCount < 3) {
      const newViolationCount = violationCount + 1;
      console.log('Simulating fullscreen violation:', newViolationCount);
      setViolationCount(newViolationCount);
      setWarningMessage(`Fullscreen violation detected. Warning ${newViolationCount} of 3.`);
      setShowWarning(true);
      
      // Call violation callback
      if (onViolationDetected) {
        onViolationDetected({
          type: 'FULLSCREEN_EXIT',
          description: `User exited fullscreen mode. Violation ${newViolationCount} of 3.`,
          timestamp: new Date().toISOString()
        });
      }
      
      // If this is the third violation, auto-submit
      if (newViolationCount >= 3) {
        console.log('Maximum violations reached, auto-submitting exam');
        setTimeout(() => {
          if (onSubmitExam) {
            onSubmitExam();
          }
        }, 3000);
      }
    }
  };

  // Function to simulate a tab switch violation for testing
  const simulateTabSwitchViolation = () => {
    if (violationCount < 3) {
      const newViolationCount = violationCount + 1;
      console.log('Simulating tab switch violation:', newViolationCount);
      setViolationCount(newViolationCount);
      setWarningMessage(`Tab switching detected. Warning ${newViolationCount} of 3.`);
      setShowWarning(true);
      
      // Call violation callback
      if (onViolationDetected) {
        onViolationDetected({
          type: 'TAB_SWITCH',
          description: `User switched to another tab. Violation ${newViolationCount} of 3.`,
          timestamp: new Date().toISOString()
        });
      }
      
      // If this is the third violation, auto-submit
      if (newViolationCount >= 3) {
        console.log('Maximum violations reached, auto-submitting exam');
        setTimeout(() => {
          if (onSubmitExam) {
            onSubmitExam();
          }
        }, 3000);
      }
    }
  };

  return (
    <>
      {/* Toggle button for switching between proctoring info and question blocks */}
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleView}
          icon={showProctoringInfo ? <Grid3X3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        >
          {showProctoringInfo ? 'Show Questions' : 'Show Proctoring'}
        </Button>
      </div>

      {/* Test buttons for development - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded shadow">
          <button 
            onClick={simulateFullscreenViolation}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs mr-2"
          >
            Simulate Fullscreen Violation
          </button>
          <button 
            onClick={simulateTabSwitchViolation}
            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
          >
            Simulate Tab Switch Violation
          </button>
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-foreground">Proctoring Warning</h3>
              </div>
              {violationCount < 3 && (
                <Button variant="ghost" size="sm" onClick={closeWarning}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <p className="text-foreground mb-4">{warningMessage}</p>
            
            {violationCount >= 3 ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive font-medium">
                  Maximum violations reached. Exam will be automatically submitted.
                </p>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button onClick={closeWarning}>Continue Exam</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FullscreenMonitor;