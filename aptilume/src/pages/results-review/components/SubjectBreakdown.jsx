import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const SubjectBreakdown = ({ subjects }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-border/20 min-w-[200px]">
          <h4 className="font-medium text-foreground mb-2">{label}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-medium">{data?.score}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correct:</span>
              <span className="font-medium">{data?.correct}/{data?.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Difficulty:</span>
              <span className="font-medium">{data?.difficulty}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10B981'; // success
    if (score >= 75) return '#3B82F6'; // primary
    if (score >= 65) return '#F59E0B'; // warning
    return '#EF4444'; // destructive
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
        <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
        Subject-wise Performance
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={subjects} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="subject" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="score" 
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            shape={(props) => {
              const { payload } = props;
              return (
                <rect
                  {...props}
                  fill={getScoreColor(payload?.score)}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        {subjects?.slice(0, 3)?.map((subject, index) => {
          const isStrong = subject?.score >= 80;
          const isWeak = subject?.score < 70;
          
          return (
            <div key={subject?.subject} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isStrong ? 'bg-success' : isWeak ? 'bg-destructive' : 'bg-warning'
                }`} />
                <div>
                  <span className="font-medium text-foreground text-sm">{subject?.subject}</span>
                  <div className="text-xs text-muted-foreground">
                    {subject?.correct}/{subject?.total} correct
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  isStrong ? 'text-success' : isWeak ? 'text-destructive' : 'text-warning'
                }`}>
                  {subject?.score}%
                </div>
                <div className="text-xs text-muted-foreground">{subject?.difficulty}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 text-sm mb-1">Recommendations:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Focus more on System Design and Node.js concepts</li>
              <li>• Your JavaScript and React skills are excellent</li>
              <li>• Consider practicing more complex database queries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectBreakdown;