import React from 'react';
import { Clock, FileText, TrendingUp, Target } from 'lucide-react';

const TestOverviewCard = ({ testData }) => {
  const overviewItems = [
    {
      icon: 'Clock',
      label: 'Duration',
      value: `${testData?.duration} minutes`,
      color: 'text-primary'
    },
    {
      icon: 'FileText',
      label: 'Questions',
      value: `${testData?.questionCount} questions`,
      color: 'text-secondary'
    },
    {
      icon: 'TrendingUp',
      label: 'Difficulty',
      value: testData?.difficulty,
      color: 'text-accent'
    },
    {
      icon: 'Target',
      label: 'Passing Score',
      value: `${testData?.passingScore}%`,
      color: 'text-success'
    }
  ];

  // Map icon names to actual Lucide icons
  const iconMap = {
    Clock: Clock,
    FileText: FileText,
    TrendingUp: TrendingUp,
    Target: Target
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Test Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewItems?.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <div key={index} className="bg-muted/30 rounded-lg p-4 text-center">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/50 mb-2 ${item?.color}`}>
                {IconComponent && <IconComponent className="h-4 w-4" />}
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{item.label}</h3>
              <p className="text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestOverviewCard;