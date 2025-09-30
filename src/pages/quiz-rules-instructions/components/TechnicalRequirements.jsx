import React from 'react';
import { Globe, Wifi, Monitor, Camera, Eye, Users, Volume2 } from 'lucide-react';

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

  // Map icon names to actual Lucide icons
  const iconMap = {
    Globe: Globe,
    Wifi: Wifi,
    Monitor: Monitor,
    Camera: Camera,
    Eye: Eye,
    Users: Users,
    Volume2: Volume2
  };

  return (
    <div className="space-y-6">
      {/* Browser Requirements */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Technical Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {browserRequirements.map((req, index) => {
            const IconComponent = iconMap[req.icon];
            return (
              <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2 mb-3">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                  <h4 className="font-medium text-foreground">{req.title}</h4>
                </div>
                <ul className="space-y-1">
                  {req.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proctoring Features */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Proctoring Features</h3>
        <div className="space-y-4">
          {proctoringFeatures.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex-shrink-0 mt-0.5">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    {feature.required && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechnicalRequirements;