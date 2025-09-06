import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-border/20">
          <p className="text-sm font-medium text-foreground">
            Question {label}
          </p>
          <p className="text-sm text-success">
            Accuracy: {payload?.[0]?.value}%
          </p>
          <p className="text-sm text-warning">
            Time: {payload?.[1]?.value}s
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
          Performance Trend Analysis
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Accuracy %</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-warning rounded-full" />
            <span className="text-sm text-muted-foreground">Time (seconds)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="question" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3B82F6' }}
          />
          <Line 
            type="monotone" 
            dataKey="time" 
            stroke="#F59E0B" 
            strokeWidth={3}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#F59E0B' }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-xl font-bold text-primary">76%</div>
          <div className="text-xs text-muted-foreground">Overall Accuracy</div>
        </div>
        <div className="text-center p-4 bg-warning/10 rounded-lg">
          <div className="text-xl font-bold text-warning">52s</div>
          <div className="text-xs text-muted-foreground">Avg. Time per Question</div>
        </div>
        <div className="text-center p-4 bg-secondary/10 rounded-lg">
          <div className="text-xl font-bold text-secondary">Steady</div>
          <div className="text-xs text-muted-foreground">Performance Pattern</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;