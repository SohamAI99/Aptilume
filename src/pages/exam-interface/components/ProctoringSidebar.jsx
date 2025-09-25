import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProctoringSidebar = ({ 
  isVisible = false, 
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
      setRecordingStatus('recording');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 },
        audio: micEnabled 
      });
      setWebcamStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setRecordingStatus('error');
      // Add violation for webcam access failure
      addViolation('webcam_access_failed', 'Failed to access webcam', 'high');
    }
  };

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitches + 1;
        setTabSwitches(newCount);
        addViolation('tab_switch', `Tab switch detected (${newCount})`, 'medium');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabSwitches]);

  // Mock face detection (in a real implementation, this would use ML models)
  useEffect(() => {
    if (!webcamEnabled || !isVisible) return;
    
    const faceDetectionInterval = setInterval(() => {
      // Simulate face detection with random values
      const faceVisible = Math.random() > 0.1; // 90% chance of face detected
      const multiple = Math.random() > 0.95; // 5% chance of multiple faces
      
      setFaceDetected(faceVisible);
      setMultipleFaces(multiple);
      
      if (!faceVisible) {
        addViolation('face_not_detected', 'Face not visible in camera', 'high');
      }
      
      if (multiple) {
        addViolation('multiple_faces', 'Multiple faces detected', 'high');
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(faceDetectionInterval);
  }, [webcamEnabled, isVisible]);

  // Mock environment noise detection
  useEffect(() => {
    if (!micEnabled || !isVisible) return;
    
    const noiseDetectionInterval = setInterval(() => {
      // Simulate noise level (0-100)
      const noiseLevel = Math.floor(Math.random() * 100);
      setEnvironmentNoise(noiseLevel);
      
      if (noiseLevel > 80) {
        addViolation('high_noise', 'High background noise detected', 'medium');
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(noiseDetectionInterval);
  }, [micEnabled, isVisible]);

  const addViolation = (type, message, severity) => {
    const violation = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date(),
      severity
    };
    
    setSuspiciousActivity(prev => [violation, ...prev.slice(0, 9)]); // Keep last 10 violations
    
    // Notify parent component
    if (onViolationDetected) {
      onViolationDetected(violation);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      case 'low':
        return 'Info';
      default:
        return 'Info';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/10 border-destructive/20';
      case 'medium':
        return 'bg-warning/10 border-warning/20';
      case 'low':
        return 'bg-muted/30 border-border';
      default:
        return 'bg-muted/30 border-border';
    }
  };

  // Calculate exam duration
  const getExamDuration = () => {
    if (!examStartTime) return '00:00:00';
    const diff = new Date() - new Date(examStartTime);
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        iconName="Shield"
        onClick={onToggle}
        className="fixed right-4 top-20 z-40 bg-white shadow-elevation-2 hover:shadow-elevation-3"
        title="Show Proctoring Panel"
      />
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-border shadow-elevation-2 z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Proctoring</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onToggle}
          />
        </div>
      </div>
      
      {/* Camera Status */}
      <div className="p-4 border-b border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name="Camera" 
                size={16} 
                className={webcamEnabled ? 'text-green-600' : 'text-destructive'} 
              />
              <span className="text-sm text-foreground">Camera</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${webcamEnabled ? 'bg-green-500' : 'bg-destructive'}`}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name="Mic" 
                size={16} 
                className={micEnabled ? 'text-green-600' : 'text-muted-foreground'} 
              />
              <span className="text-sm text-foreground">Microphone</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${micEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name="Monitor" 
                size={16} 
                className={screenRecording ? 'text-green-600' : 'text-muted-foreground'} 
              />
              <span className="text-sm text-foreground">Screen Recording</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${screenRecording ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
        </div>

        {/* Live Camera Feed */}
        <div className="mt-4 aspect-video bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden relative">
          {webcamEnabled ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <div className={`w-3 h-3 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-destructive'}`}></div>
              </div>
              {multipleFaces && (
                <div className="absolute top-2 left-2 bg-destructive/80 text-white text-xs px-2 py-1 rounded">
                  Multiple Faces
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <Icon name="CameraOff" size={32} className="text-destructive mx-auto mb-2" />
              <p className="text-xs text-destructive">Camera Disabled</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Activity Monitor */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="font-medium text-foreground mb-3">Activity Monitor</h4>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="text-lg font-semibold text-foreground">{tabSwitches}</div>
              <div className="text-xs text-muted-foreground">Tab Switches</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="text-lg font-semibold text-foreground">{suspiciousActivity.length}</div>
              <div className="text-xs text-muted-foreground">Violations</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="text-lg font-semibold text-foreground">{environmentNoise}%</div>
              <div className="text-xs text-muted-foreground">Noise Level</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="text-lg font-semibold text-foreground">{recordingStatus === 'recording' ? 'ON' : 'OFF'}</div>
              <div className="text-xs text-muted-foreground">Recording</div>
            </div>
          </div>

          {/* Violations Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-foreground">Recent Activity</h5>
              <span className="text-xs text-muted-foreground">
                {suspiciousActivity.length} events
              </span>
            </div>
            {suspiciousActivity.length === 0 ? (
              <div className="p-3 bg-muted/20 rounded-lg border border-border text-center">
                <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No violations detected</p>
              </div>
            ) : (
              suspiciousActivity.map((violation) => (
                <div 
                  key={violation.id} 
                  className={`p-3 rounded-lg border ${getSeverityBg(violation.severity)}`}
                >
                  <div className="flex items-start space-x-2">
                    <Icon 
                      name={getSeverityIcon(violation.severity)} 
                      size={16} 
                      className={`flex-shrink-0 mt-0.5 ${getSeverityColor(violation.severity)}`} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium">{violation.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {violation.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Session Time</p>
            <p className="text-sm font-mono text-foreground">
              {getExamDuration()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className={`text-sm font-medium ${
              suspiciousActivity.length > 5 ? 'text-destructive' : 
              suspiciousActivity.length > 2 ? 'text-warning' : 'text-success'
            }`}>
              {suspiciousActivity.length > 5 ? 'High Risk' : 
               suspiciousActivity.length > 2 ? 'Medium Risk' : 'Low Risk'}
            </p>
          </div>
        </div>
        
        {suspiciousActivity.length > 5 && (
          <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-center">
            <p className="text-xs text-destructive font-medium">
              High violation count detected. Exam may be flagged for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProctoringSidebar;