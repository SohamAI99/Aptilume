import React from 'react';
import Icon from '../../../components/AppIcon';

const TechnicalRequirements = () => {
  const browserRequirements = [
    {
      icon: 'Globe',
      title: 'Supported Browsers',
      items: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+']
    },
    {
      icon: 'Wifi',
      title: 'Internet Connection',
      items: ['Stable broadband connection', 'Minimum 2 Mbps speed', 'Avoid mobile hotspots']
    },
    {
      icon: 'Monitor',
      title: 'Display Requirements',
      items: ['Minimum 1024x768 resolution', 'Full-screen mode recommended', 'Disable screen savers']
    }
  ];

  const proctoringFeatures = [
    {
      icon: 'Camera',
      title: 'Webcam Monitoring',
      description: 'Your webcam will capture periodic snapshots during the exam',
      required: true
    },
    {
      icon: 'Eye',
      title: 'Tab Switch Detection',
      description: 'System will detect if you switch to other browser tabs',
      required: true
    },
    {
      icon: 'Users',
      title: 'Face Count Monitoring',
      description: 'AI will monitor for multiple faces in the camera frame',
      required: true
    },
    {
      icon: 'Volume2',
      title: 'Audio Monitoring',
      description: 'Microphone may be used to detect unusual sounds',
      required: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Browser Requirements */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Technical Requirements</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {browserRequirements?.map((req, index) => (
            <div key={index} className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name={req?.icon} size={16} className="text-primary" />
                <h4 className="font-medium text-foreground text-sm">{req?.title}</h4>
              </div>
              <ul className="space-y-1">
                {req?.items?.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-xs text-muted-foreground flex items-center space-x-2">
                    <Icon name="Check" size={12} className="text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Proctoring Features */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Proctoring Features</h3>
        </div>
        
        <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
            <div>
              <p className="text-sm font-medium text-error">Important Notice</p>
              <p className="text-xs text-muted-foreground mt-1">
                This exam uses AI-powered proctoring. Please ensure you have the required permissions and setup.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {proctoringFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={16} className="text-warning" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground text-sm">{feature?.title}</h4>
                  {feature?.required && (
                    <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full">Required</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalRequirements;