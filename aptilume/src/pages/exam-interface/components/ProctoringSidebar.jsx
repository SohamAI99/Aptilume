import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProctoringSidebar = ({ 
  isVisible = false, 
  onToggle,
  violations = [],
  webcamEnabled = true,
  micEnabled = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tabSwitches, setTabSwitches] = useState(0);
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock proctoring data
  const mockViolations = [
    {
      id: 1,
      type: 'tab_switch',
      message: 'Tab switch detected',
      timestamp: new Date(Date.now() - 300000),
      severity: 'medium'
    },
    {
      id: 2,
      type: 'face_not_detected',
      message: 'Face not visible in camera',
      timestamp: new Date(Date.now() - 180000),
      severity: 'high'
    },
    {
      id: 3,
      type: 'multiple_faces',
      message: 'Multiple faces detected',
      timestamp: new Date(Date.now() - 120000),
      severity: 'high'
    }
  ];

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
        </div>

        {/* Live Camera Feed Placeholder */}
        <div className="mt-4 aspect-video bg-muted rounded-lg border border-border flex items-center justify-center">
          {webcamEnabled ? (
            <div className="text-center">
              <Icon name="Camera" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Live Camera Feed</p>
            </div>
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
              <div className="text-lg font-semibold text-foreground">3</div>
              <div className="text-xs text-muted-foreground">Tab Switches</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="text-lg font-semibold text-foreground">2</div>
              <div className="text-xs text-muted-foreground">Violations</div>
            </div>
          </div>

          {/* Violations Log */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Recent Activity</h5>
            {mockViolations?.map((violation) => (
              <div key={violation?.id} className="p-3 bg-muted/20 rounded-lg border border-border">
                <div className="flex items-start space-x-2">
                  <Icon 
                    name={getSeverityIcon(violation?.severity)} 
                    size={16} 
                    className={`flex-shrink-0 mt-0.5 ${getSeverityColor(violation?.severity)}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">{violation?.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {violation?.timestamp?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Session Time</p>
          <p className="text-sm font-mono text-foreground">
            {currentTime?.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProctoringSidebar;