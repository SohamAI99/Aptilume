import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const OverviewSection = ({ resultsData }) => {
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  // Calculate summary statistics
  const totalQuestions = resultsData?.questions?.length || 0;
  const correctAnswers = resultsData?.questions?.filter(q => q?.isCorrect)?.length || 0;
  const incorrectAnswers = resultsData?.questions?.filter(q => !q?.isCorrect && q?.selectedAnswer !== null)?.length || 0;
  const unanswered = resultsData?.questions?.filter(q => q?.selectedAnswer === null)?.length || 0;

  const accuracyData = [
    { name: 'Correct', value: correctAnswers, color: '#10B981' },
    { name: 'Incorrect', value: incorrectAnswers, color: '#EF4444' },
    { name: 'Unanswered', value: unanswered, color: '#6B7280' }
  ];

  const subjectData = resultsData?.subjects?.map(subject => ({
    name: subject?.name,
    score: subject?.score,
    total: subject?.total,
    percentage: subject?.percentage
  })) || [];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Score</p>
              <p className="text-2xl font-bold text-foreground">
                {resultsData?.overall?.score}/{resultsData?.overall?.totalMarks}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Trophy" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-foreground">
                {((correctAnswers / totalQuestions) * 100)?.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="Target" size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.floor(resultsData?.timeSpent / 3600)}h {Math.floor((resultsData?.timeSpent % 3600) / 60)}m
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rank</p>
              <p className="text-2xl font-bold text-foreground">
                #{resultsData?.overall?.rank}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Icon name="Award" size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Performance */}
        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
            Subject-wise Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'score' ? `${value}/${subjectData?.find(s => s?.score === value)?.total || 0}` : `${value}%`,
                  name === 'score' ? 'Score' : 'Percentage'
                ]}
              />
              <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Answer Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Icon name="PieChart" size={20} className="mr-2 text-primary" />
            Answer Distribution
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {accuracyData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} questions`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {accuracyData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item?.color }} />
                <span className="text-sm text-muted-foreground">{item?.name}: {item?.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Detailed Subject Analysis */}
      <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Icon name="FileText" size={20} className="mr-2 text-primary" />
          Detailed Subject Analysis
        </h3>
        <div className="space-y-6">
          {resultsData?.subjects?.map((subject, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground">{subject?.name}</h4>
                <div className="text-right">
                  <span className="text-lg font-bold text-foreground">
                    {subject?.score}/{subject?.total}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({subject?.percentage}%)
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{subject?.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${subject?.percentage}%` }}
                  />
                </div>
              </div>

              {/* Subject Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{subject?.correct || Math.floor(subject?.questions * subject?.percentage / 100)}</div>
                  <div className="text-muted-foreground">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {(subject?.questions || 25) - (subject?.correct || Math.floor(subject?.questions * subject?.percentage / 100))}
                  </div>
                  <div className="text-muted-foreground">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-muted-foreground">
                    {subject?.questions || 25}
                  </div>
                  <div className="text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;