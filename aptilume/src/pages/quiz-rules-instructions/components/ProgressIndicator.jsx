import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ testStats }) => {
  const stats = [
    {
      icon: 'Users',
      label: 'Total Attempts',
      value: testStats?.totalAttempts?.toLocaleString(),
      color: 'text-primary'
    },
    {
      icon: 'TrendingUp',
      label: 'Average Score',
      value: `${testStats?.averageScore}%`,
      color: 'text-success'
    },
    {
      icon: 'Clock',
      label: 'Avg. Completion',
      value: `${testStats?.averageTime} min`,
      color: 'text-warning'
    },
    {
      icon: 'Award',
      label: 'Pass Rate',
      value: `${testStats?.passRate}%`,
      color: 'text-accent'
    }
  ];

  const difficultyDistribution = [
    { level: 'Easy', percentage: 30, color: 'bg-success' },
    { level: 'Medium', percentage: 50, color: 'bg-warning' },
    { level: 'Hard', percentage: 20, color: 'bg-error' }
  ];

  return (
    <div className="space-y-6">
      {/* Test Statistics */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Test Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-muted/20 rounded-lg">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/50 mb-2 ${stat?.color}`}>
                <Icon name={stat?.icon} size={20} />
              </div>
              <p className="text-lg font-semibold text-foreground">{stat?.value}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Difficulty Distribution */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="PieChart" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Question Difficulty</h3>
        </div>
        
        <div className="space-y-4">
          {difficultyDistribution?.map((level, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{level?.level}</span>
                <span className="text-sm text-muted-foreground">{level?.percentage}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${level?.color}`}
                  style={{ width: `${level?.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Questions are dynamically selected based on your performance to provide optimal challenge level
          </p>
        </div>
      </div>
      {/* Performance Insights */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Performance Insights</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <div>
              <p className="text-sm font-medium text-success">Top Performers</p>
              <p className="text-xs text-muted-foreground">Score above 85% and complete within 75% of allotted time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="Clock" size={16} className="text-warning" />
            <div>
              <p className="text-sm font-medium text-warning">Time Management</p>
              <p className="text-xs text-muted-foreground">Most candidates use 85-95% of available time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <Icon name="BookOpen" size={16} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-primary">Common Challenges</p>
              <p className="text-xs text-muted-foreground">System design and algorithmic complexity questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;