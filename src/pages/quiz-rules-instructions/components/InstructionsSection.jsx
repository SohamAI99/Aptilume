import React from 'react';
import { ArrowLeft, ArrowRight, Save, Bookmark } from 'lucide-react';

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

  // Map icon names to actual Lucide icons
  const iconMap = {
    ArrowLeft: ArrowLeft,
    ArrowRight: ArrowRight,
    Save: Save,
    Bookmark: Bookmark
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Navigation Instructions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {navigationInstructions.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3 mb-3">
                {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                <h3 className="font-medium text-foreground">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-4">Question Status Marking System</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {markingSystem.map((item, index) => (
          <div 
            key={index} 
            className={`${item.color} rounded-lg p-3 text-center relative border border-border`}
          >
            {item.hasGreenDot && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
            <h4 className="font-medium text-foreground text-sm mb-1">{item.label}</h4>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructionsSection;