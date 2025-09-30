import React from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';

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
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-muted-foreground font-medium">Total Attempts</h3>
              <p className="text-2xl font-bold text-foreground">{totalTestsTaken}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-muted-foreground font-medium">Completed</h3>
              <p className="text-2xl font-bold text-foreground">{completedTests}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <h3 className="text-muted-foreground font-medium">In Progress</h3>
              <p className="text-2xl font-bold text-foreground">{inProgressTests}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsWidget;