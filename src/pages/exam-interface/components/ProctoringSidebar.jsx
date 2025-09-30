import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Monitor, Volume2, Eye, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const ProctoringSidebar = ({ 
  isVisible = true, // Default to true to ensure it's visible during exams
  onToggle,
  violations = [],
  webcamEnabled = true,
  micEnabled = false,
  onViolationDetected,
  examStartTime
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tabSwitches, setTabSwitches] = useState(0);
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);
  const [faceDetected, setFaceDetected] = useState(true);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [screenRecording, setScreenRecording] = useState(false);
  const [environmentNoise, setEnvironmentNoise] = useState(0);
  const [webcamStream, setWebcamStream] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, paused, error
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize webcam
  useEffect(() => {
    if (webcamEnabled && isVisible) {
      initializeWebcam();
    }
    
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamEnabled, isVisible]);

  const initializeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setRecordingStatus('recording');
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setRecordingStatus('error');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getRecordingStatusColor = () => {
    switch (recordingStatus) {
      case 'recording': return 'text-success';
      case 'paused': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRecordingStatusText = () => {
    switch (recordingStatus) {
      case 'recording': return 'Recording';
      case 'paused': return 'Paused';
      case 'error': return 'Error';
      default: return 'Idle';
    }
  };

  // Always render the component but control visibility with CSS
  // This ensures the proctoring features are always active during exams
  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Proctoring Panel</h3>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {/* Time Display */}
        <div className="p-4 border-b border-border">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Webcam Preview */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            Webcam Feed
          </h4>
          <div className="relative">
            <div className="bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              {webcamEnabled ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Webcam disabled</p>
                </div>
              )}
            </div>
            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center ${
              recordingStatus === 'recording' ? 'bg-success/10 text-success' :
              recordingStatus === 'error' ? 'bg-destructive/10 text-destructive' :
              'bg-muted/10 text-muted-foreground'
            }`}>
              <div className={`h-2 w-2 rounded-full mr-1 ${
                recordingStatus === 'recording' ? 'bg-success animate-pulse' :
                recordingStatus === 'error' ? 'bg-destructive' :
                'bg-muted-foreground'
              }`}></div>
              {getRecordingStatusText()}
            </div>
          </div>
        </div>

        {/* Proctoring Status */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3">Monitoring Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-foreground">Face Detection</span>
              </div>
              {faceDetected ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-foreground">Single Person</span>
              </div>
              {!multipleFaces ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-foreground">Screen Activity</span>
              </div>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Volume2 className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-foreground">Audio Monitoring</span>
              </div>
              {micEnabled ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Violations */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3">Recent Violations</h4>
          {violations.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {violations.slice(-5).map((violation, index) => (
                <div key={index} className="p-2 bg-destructive/10 rounded border border-destructive/20">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-destructive">{violation.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(violation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground mt-1">{violation.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No violations detected</p>
            </div>
          )}
        </div>

        {/* Environment Monitoring */}
        <div className="p-4">
          <h4 className="font-medium text-foreground mb-3">Environment</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Background Noise</span>
                <span className="text-muted-foreground">{environmentNoise}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-success" 
                  style={{ width: `${Math.min(environmentNoise, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProctoringSidebar;