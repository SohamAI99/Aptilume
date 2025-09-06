import React from 'react';
import Icon from '../../../components/AppIcon';

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

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Info" size={20} color="white" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Test Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewItems?.map((item, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4 text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/50 mb-2 ${item?.color}`}>
              <Icon name={item?.icon} size={16} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{item?.label}</p>
            <p className="font-semibold text-foreground">{item?.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">Single Attempt Only</p>
            <p className="text-xs text-muted-foreground mt-1">
              You can only attempt this test once. Make sure you're ready before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOverviewCard;