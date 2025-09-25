import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsWidget = ({ stats }) => {
  // If no stats provided, show loading state
  if (!stats) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-muted-foreground font-medium">Total Attempts</h3>
            <div className="h-8 bg-muted rounded animate-pulse mt-2"></div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-muted-foreground font-medium">Completed</h3>
            <div className="h-8 bg-muted rounded animate-pulse mt-2"></div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-muted-foreground font-medium">In Progress</h3>
            <div className="h-8 bg-muted rounded animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Extract stats or provide defaults
  const { totalTestsTaken = 0, completedTests = 0, inProgressTests = 0 } = stats;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <h3 className="text-primary font-medium">Total Attempts</h3>
          <p className="text-3xl font-bold text-primary">{totalTestsTaken}</p>
          <Icon name="FileText" size={24} className="mt-2 text-primary" />
        </div>
        <div className="bg-success/10 p-4 rounded-lg border border-success/20">
          <h3 className="text-success font-medium">Completed</h3>
          <p className="text-3xl font-bold text-success">{completedTests}</p>
          <Icon name="CheckCircle" size={24} className="mt-2 text-success" />
        </div>
        <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
          <h3 className="text-warning font-medium">In Progress</h3>
          <p className="text-3xl font-bold text-warning">{inProgressTests}</p>
          <Icon name="Clock" size={24} className="mt-2 text-warning" />
        </div>
      </div>
    </div>
  );
};

export default QuickStatsWidget;