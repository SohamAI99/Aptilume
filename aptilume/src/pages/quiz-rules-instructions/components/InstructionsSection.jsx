import React from 'react';
import Icon from '../../../components/AppIcon';

const InstructionsSection = () => {
  const navigationInstructions = [
    {
      icon: 'ArrowLeft',
      title: 'Previous Button',
      description: 'Navigate to the previous question without saving current answer'
    },
    {
      icon: 'ArrowRight',
      title: 'Next Button',
      description: 'Move to next question without saving current answer'
    },
    {
      icon: 'Save',
      title: 'Save & Next',
      description: 'Save current answer and automatically move to next question'
    },
    {
      icon: 'Bookmark',
      title: 'Mark for Review',
      description: 'Flag question for later review while keeping current answer'
    }
  ];

  const markingSystem = [
    {
      color: 'bg-gray-400',
      label: 'Not Visited',
      description: 'Questions you haven\'t viewed yet'
    },
    {
      color: 'bg-orange-400',
      label: 'Seen, No Answer',
      description: 'Questions viewed but not answered'
    },
    {
      color: 'bg-green-400',
      label: 'Answered',
      description: 'Questions with saved answers'
    },
    {
      color: 'bg-purple-400',
      label: 'Marked for Review',
      description: 'Questions flagged for later review'
    },
    {
      color: 'bg-purple-400 relative',
      label: 'Answered + Marked',
      description: 'Questions answered and marked for review',
      hasGreenDot: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Instructions */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Navigation" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Navigation Controls</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationInstructions?.map((instruction, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={instruction?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{instruction?.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{instruction?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Marking System */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Palette" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Question Palette System</h3>
        </div>
        
        <div className="space-y-3">
          {markingSystem?.map((mark, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded ${mark?.color} flex items-center justify-center`}>
                {mark?.hasGreenDot && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </div>
              <div>
                <span className="font-medium text-foreground text-sm">{mark?.label}</span>
                <p className="text-xs text-muted-foreground">{mark?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Submission Process */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
            <Icon name="CheckCircle" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Submission Process</h3>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Icon name="Circle" size={4} className="mt-2 flex-shrink-0" />
            <p>Click 'Submit Test' button when you're ready to finish</p>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Circle" size={4} className="mt-2 flex-shrink-0" />
            <p>Re-enter your login password for security verification</p>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Circle" size={4} className="mt-2 flex-shrink-0" />
            <p>Review your answers in the confirmation modal</p>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Circle" size={4} className="mt-2 flex-shrink-0" />
            <p>Test will auto-submit when timer reaches zero</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsSection;