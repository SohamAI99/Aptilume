import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AIAnalytics = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for charts
  const performanceData = [
    { date: 'Mon', score: 75, accuracy: 82 },
    { date: 'Tue', score: 82, accuracy: 88 },
    { date: 'Wed', score: 78, accuracy: 85 },
    { date: 'Thu', score: 85, accuracy: 90 },
    { date: 'Fri', score: 88, accuracy: 92 },
    { date: 'Sat', score: 80, accuracy: 87 },
    { date: 'Sun', score: 90, accuracy: 94 },
  ];

  const subjectData = [
    { name: 'Quantitative', value: 35 },
    { name: 'Logical', value: 25 },
    { name: 'Verbal', value: 20 },
    { name: 'Technical', value: 20 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const insights = [
    { id: 1, text: "Your performance in Quantitative section has improved by 12% this week", type: "positive" },
    { id: 2, text: "Consider spending more time on Logical Reasoning questions", type: "suggestion" },
    { id: 3, text: "Consistent daily practice can improve your accuracy by up to 15%", type: "tip" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Performance Analytics</h2>
          <p className="text-muted-foreground mt-1">
            Detailed insights powered by artificial intelligence
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="glass-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <Icon name="RefreshCw" size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <span className="text-sm text-muted-foreground">Avg. Score</span>
          </div>
          <div className="text-2xl font-bold">82.4%</div>
          <div className="text-xs text-success flex items-center gap-1">
            <Icon name="ArrowUp" size={12} />
            5.2% from last week
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={20} className="text-primary" />
            <span className="text-sm text-muted-foreground">Avg. Time</span>
          </div>
          <div className="text-2xl font-bold">42m</div>
          <div className="text-xs text-muted-foreground">Per test</div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={20} className="text-accent" />
            <span className="text-sm text-muted-foreground">Accuracy</span>
          </div>
          <div className="text-2xl font-bold">87.3%</div>
          <div className="text-xs text-success flex items-center gap-1">
            <Icon name="ArrowUp" size={12} />
            2.1% from last week
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Award" size={20} className="text-warning" />
            <span className="text-sm text-muted-foreground">Rank</span>
          </div>
          <div className="text-2xl font-bold">#1,247</div>
          <div className="text-xs text-success flex items-center gap-1">
            <Icon name="ArrowUp" size={12} />
            142 places up
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ stroke: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Subject Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Sparkles" size={20} className="text-accent" />
          <h3 className="font-semibold">AI Insights & Recommendations</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-3 rounded-lg border ${
                insight.type === 'positive' 
                  ? 'bg-success/10 border-success/20' 
                  : insight.type === 'suggestion' 
                    ? 'bg-warning/10 border-warning/20' 
                    : 'bg-info/10 border-info/20'
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon 
                  name={
                    insight.type === 'positive' 
                      ? 'ThumbsUp' 
                      : insight.type === 'suggestion' 
                        ? 'Lightbulb' 
                        : 'Info'
                  } 
                  size={16} 
                  className={
                    insight.type === 'positive' 
                      ? 'text-success' 
                      : insight.type === 'suggestion' 
                        ? 'text-warning' 
                        : 'text-info'
                  } 
                />
                <p className="text-sm">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;