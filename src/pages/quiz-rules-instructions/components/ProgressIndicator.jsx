import React from 'react';
import { Users, TrendingUp, Clock, Award, BarChart3 } from 'lucide-react';

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

  // Map icon names to actual Lucide icons
  const iconMap = {
    Users: Users,
    TrendingUp: TrendingUp,
    Clock: Clock,
    Award: Award,
    BarChart3: BarChart3
  };

  return (
    <div className="space-y-6">
      {/* Test Statistics */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Test Statistics</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon];
            return (
              <div key={index} className="bg-muted/30 rounded-lg p-4 text-center border border-border">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/50 mb-2 ${stat.color}`}>
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Difficulty Distribution</h3>
        <div className="space-y-3">
          {difficultyDistribution.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{item.level}</span>
                <span className="text-muted-foreground">{item.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.color}`} 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;