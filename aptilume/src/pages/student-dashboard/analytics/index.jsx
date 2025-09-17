import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d
  const [loading, setLoading] = useState(true);

  // Mock data for analytics
  const mockPerformanceData = [
    { date: '2025-09-01', score: 75 },
    { date: '2025-09-05', score: 82 },
    { date: '2025-09-10', score: 78 },
    { date: '2025-09-15', score: 85 },
    { date: '2025-09-20', score: 88 },
    { date: '2025-09-25', score: 92 }
  ];

  const mockSubjectPerformance = [
    { subject: 'Mathematics', score: 85, tests: 12 },
    { subject: 'Logical Reasoning', score: 78, tests: 8 },
    { subject: 'Verbal Ability', score: 92, tests: 15 },
    { subject: 'Technical Skills', score: 88, tests: 10 }
  ];

  const mockProgressData = [
    { week: 'Week 1', completed: 3, avgScore: 75 },
    { week: 'Week 2', completed: 5, avgScore: 82 },
    { week: 'Week 3', completed: 4, avgScore: 78 },
    { week: 'Week 4', completed: 6, avgScore: 85 }
  ];

  useEffect(() => {
    // Simulate fetching analytics data
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                  Track your progress and performance over time
                </p>
              </div>
              <div className="flex gap-2">
                {timeRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={timeRange === option.value ? 'default' : 'outline'}
                    onClick={() => setTimeRange(option.value)}
                    size="sm"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Icon name="FileText" size={20} className="text-primary" />
                      </div>
                      <h3 className="font-medium">Tests Taken</h3>
                    </div>
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-sm text-muted-foreground mt-1">+3 from last month</div>
                  </div>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-success/10 p-2 rounded-lg">
                        <Icon name="TrendingUp" size={20} className="text-success" />
                      </div>
                      <h3 className="font-medium">Avg. Score</h3>
                    </div>
                    <div className="text-3xl font-bold">82%</div>
                    <div className="text-sm text-muted-foreground mt-1">+5% from last month</div>
                  </div>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <Icon name="Award" size={20} className="text-accent" />
                      </div>
                      <h3 className="font-medium">Best Score</h3>
                    </div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm text-muted-foreground mt-1">In Mathematics</div>
                  </div>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-warning/10 p-2 rounded-lg">
                        <Icon name="Target" size={20} className="text-warning" />
                      </div>
                      <h3 className="font-medium">Accuracy</h3>
                    </div>
                    <div className="text-3xl font-bold">87%</div>
                    <div className="text-sm text-muted-foreground mt-1">+2% from last month</div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Performance Over Time</h2>
                    <Button variant="outline" size="sm" iconName="Download">
                      Export
                    </Button>
                  </div>
                  
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {mockPerformanceData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="text-xs text-muted-foreground mb-2">
                          {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div 
                          className="w-full bg-primary rounded-t-lg transition-all duration-500 ease-out"
                          style={{ height: `${data.score}%` }}
                        ></div>
                        <div className="text-sm font-medium mt-2">{data.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Subject Performance</h2>
                    <div className="space-y-4">
                      {mockSubjectPerformance.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{subject.subject}</div>
                            <div className="text-sm text-muted-foreground">{subject.tests} tests</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-border rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${subject.score}%` }}
                              ></div>
                            </div>
                            <span className="font-medium w-10">{subject.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Weekly Progress</h2>
                    <div className="space-y-4">
                      {mockProgressData.map((week, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{week.week}</div>
                            <div className="text-sm text-muted-foreground">{week.completed} tests completed</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{week.avgScore}%</div>
                            <div className="text-sm text-muted-foreground">Avg. score</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;