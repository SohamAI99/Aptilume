import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [loading, setLoading] = useState(true);

  // Mock data for analytics
  const mockQuizPerformance = [
    { name: 'JavaScript Basics', attempts: 42, avgScore: 78, highestScore: 95 },
    { name: 'React Components', attempts: 28, avgScore: 82, highestScore: 98 },
    { name: 'Advanced Algorithms', attempts: 15, avgScore: 65, highestScore: 88 },
    { name: 'CSS Fundamentals', attempts: 36, avgScore: 85, highestScore: 96 },
    { name: 'Database Design', attempts: 22, avgScore: 72, highestScore: 92 }
  ];

  const mockStudentProgress = [
    { name: 'John Doe', quizzesCompleted: 12, avgScore: 85, improvement: 12 },
    { name: 'Jane Smith', quizzesCompleted: 8, avgScore: 92, improvement: 8 },
    { name: 'Robert Johnson', quizzesCompleted: 5, avgScore: 78, improvement: -3 },
    { name: 'Emily Davis', quizzesCompleted: 15, avgScore: 88, improvement: 15 },
    { name: 'Michael Wilson', quizzesCompleted: 7, avgScore: 76, improvement: 5 }
  ];

  useEffect(() => {
    // Simulate fetching analytics data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  const getImprovementBadge = (improvement) => {
    if (improvement > 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-success flex items-center gap-1">
          <Icon name="TrendingUp" size={12} />
          +{improvement}%
        </span>
      );
    } else if (improvement < 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-error/20 text-error flex items-center gap-1">
          <Icon name="TrendingDown" size={12} />
          {improvement}%
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-muted text-foreground">
        No change
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                  Track quiz performance and student progress
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
                      <h3 className="font-medium">Total Quizzes</h3>
                    </div>
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-sm text-muted-foreground mt-1">+3 from last week</div>
                  </div>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <Icon name="Users" size={20} className="text-accent" />
                      </div>
                      <h3 className="font-medium">Active Students</h3>
                    </div>
                    <div className="text-3xl font-bold">127</div>
                    <div className="text-sm text-muted-foreground mt-1">+12 from last week</div>
                  </div>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-success/10 p-2 rounded-lg">
                        <Icon name="BarChart3" size={20} className="text-success" />
                      </div>
                      <h3 className="font-medium">Avg. Score</h3>
                    </div>
                    <div className="text-3xl font-bold">82%</div>
                    <div className="text-sm text-muted-foreground mt-1">+5% from last week</div>
                  </div>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-warning/10 p-2 rounded-lg">
                        <Icon name="TrendingUp" size={20} className="text-warning" />
                      </div>
                      <h3 className="font-medium">Completion Rate</h3>
                    </div>
                    <div className="text-3xl font-bold">87%</div>
                    <div className="text-sm text-muted-foreground mt-1">+3% from last week</div>
                  </div>
                </div>

                {/* Quiz Performance */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Quiz Performance</h2>
                    <Button variant="outline" size="sm" iconName="Download">
                      Export
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">Quiz Name</th>
                          <th className="text-left py-3 px-4 font-medium">Attempts</th>
                          <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                          <th className="text-left py-3 px-4 font-medium">Highest Score</th>
                          <th className="text-left py-3 px-4 font-medium">Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockQuizPerformance.map((quiz, index) => (
                          <tr key={index} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{quiz.name}</td>
                            <td className="py-3 px-4">{quiz.attempts}</td>
                            <td className="py-3 px-4">{quiz.avgScore}%</td>
                            <td className="py-3 px-4">{quiz.highestScore}%</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-border rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${quiz.avgScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{quiz.avgScore}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Student Progress */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Top Student Progress</h2>
                    <Button variant="outline" size="sm" iconName="Download">
                      Export
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">Student</th>
                          <th className="text-left py-3 px-4 font-medium">Quizzes Completed</th>
                          <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                          <th className="text-left py-3 px-4 font-medium">Improvement</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockStudentProgress.map((student, index) => (
                          <tr key={index} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{student.name}</td>
                            <td className="py-3 px-4">{student.quizzesCompleted}</td>
                            <td className="py-3 px-4">{student.avgScore}%</td>
                            <td className="py-3 px-4">{getImprovementBadge(student.improvement)}</td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" iconName="Eye">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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