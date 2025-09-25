import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceAnalytics = ({ resultsData }) => {
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  // Prepare accuracy trend data
  const accuracyTrendData = resultsData?.analytics?.accuracyTrend?.map((point, index) => ({
    question: `Q${point?.question}`,
    accuracy: point?.accuracy,
    index: index + 1
  })) || [];

  // Prepare difficulty analysis data
  const difficultyData = resultsData?.analytics?.difficultyAnalysis?.map(level => ({
    ...level,
    accuracy: (level?.correct / level?.attempted * 100)?.toFixed(1)
  })) || [];

  // Prepare time distribution data
  const timeDistributionData = resultsData?.analytics?.timeDistribution || [];

  // Calculate peer comparison data
  const peerComparisonData = resultsData?.subjects?.map(subject => ({
    name: subject?.name,
    yourScore: subject?.percentage,
    average: Math.max(0, subject?.percentage - Math.random() * 20 + 10), // Mock peer average
    topScore: Math.min(100, subject?.percentage + Math.random() * 15 + 5) // Mock top score
  })) || [];

  return (
    <div className="space-y-8">
      {/* Performance Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Strong Areas</h3>
            <Icon name="TrendingUp" size={20} className="text-green-600" />
          </div>
          <div className="space-y-2">
            {resultsData?.subjects
              ?.filter(s => s?.percentage >= 80)
              ?.map((subject, index) => (
                <div key={index} className="text-sm">
                  <span className="text-green-600 font-medium">{subject?.name}</span>
                  <span className="text-muted-foreground ml-2">({subject?.percentage}%)</span>
                </div>
              ))}
            {resultsData?.subjects?.filter(s => s?.percentage >= 80)?.length === 0 && (
              <p className="text-sm text-muted-foreground">Focus on improving overall performance</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Improvement Areas</h3>
            <Icon name="Target" size={20} className="text-orange-600" />
          </div>
          <div className="space-y-2">
            {resultsData?.subjects
              ?.filter(s => s?.percentage < 70)
              ?.map((subject, index) => (
                <div key={index} className="text-sm">
                  <span className="text-orange-600 font-medium">{subject?.name}</span>
                  <span className="text-muted-foreground ml-2">({subject?.percentage}%)</span>
                </div>
              ))}
            {resultsData?.subjects?.filter(s => s?.percentage < 70)?.length === 0 && (
              <p className="text-sm text-green-600">Great performance across all subjects!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Time Management</h3>
            <Icon name="Clock" size={20} className="text-blue-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg per question:</span>
              <span className="font-medium">{Math.round(resultsData?.timeSpent / resultsData?.questions?.length)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total time:</span>
              <span className="font-medium">
                {Math.floor(resultsData?.timeSpent / 3600)}h {Math.floor((resultsData?.timeSpent % 3600) / 60)}m
              </span>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded ${
                resultsData?.timeSpent < 7200 ? 'bg-green-100 text-green-700' : 
                resultsData?.timeSpent < 9000 ? 'bg-yellow-100 text-yellow-700': 'bg-red-100 text-red-700'
              }`}>
                {resultsData?.timeSpent < 7200 ? 'Efficient' : 
                 resultsData?.timeSpent < 9000 ? 'Good' : 'Could improve'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Accuracy Trend Chart */}
      <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
          Accuracy Trend Throughout Exam
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={accuracyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="question" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          This chart shows how your accuracy changed as you progressed through the exam
        </p>
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Difficulty Analysis */}
        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
            Performance by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name, props) => [
                  name === 'accuracy' ? `${value}%` : value,
                  name === 'accuracy' ? 'Accuracy' : name === 'attempted' ? 'Attempted' : 'Correct'
                ]}
              />
              <Bar dataKey="accuracy" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {difficultyData?.map((level, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="font-medium">{level?.level}:</span>
                <span className="text-muted-foreground">
                  {level?.correct}/{level?.attempted} correct ({level?.accuracy}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Icon name="PieChart" size={20} className="mr-2 text-primary" />
            Time Distribution by Subject
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timeDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="percentage"
                label={({ subject, percentage }) => `${subject}: ${percentage?.toFixed(1)}%`}
                labelLine={false}
              >
                {timeDistributionData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value?.toFixed(1)}%`, 'Time Spent']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Peer Comparison */}
      <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Icon name="Users" size={20} className="mr-2 text-primary" />
          Performance vs Peers
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={peerComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [
                `${value?.toFixed(1)}%`,
                name === 'yourScore' ? 'Your Score' : 
                name === 'average' ? 'Peer Average' : 'Top Score'
              ]}
            />
            <Bar dataKey="average" fill="#E5E7EB" name="average" radius={[2, 2, 0, 0]} />
            <Bar dataKey="yourScore" fill="#3B82F6" name="yourScore" radius={[2, 2, 0, 0]} />
            <Bar dataKey="topScore" fill="#10B981" name="topScore" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-E5E7EB" />
            <span className="text-sm text-muted-foreground">Peer Average</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Your Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Top Score</span>
          </div>
        </div>
      </div>
      {/* Recommendations */}
      <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Icon name="Lightbulb" size={20} className="mr-2 text-primary" />
          Personalized Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Study Focus Areas</h4>
            {resultsData?.subjects
              ?.filter(s => s?.percentage < 80)
              ?.map((subject, index) => (
                <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Target" size={16} className="text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">{subject?.name}</p>
                      <p className="text-sm text-orange-700">
                        Focus on improving accuracy. Current: {subject?.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Strategy Tips</h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Clock" size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Time Management</p>
                    <p className="text-sm text-blue-700">
                      {resultsData?.timeSpent > 9000 
                        ? "Try to speed up on easier questions to save time for difficult ones"
                        : "Good pacing! Maintain this approach in future exams"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Strengths</p>
                    <p className="text-sm text-green-700">
                      Excellent performance on {resultsData?.subjects?.filter(s => s?.percentage >= 80)?.length > 0 
                        ? resultsData?.subjects?.filter(s => s?.percentage >= 80)?.[0]?.name 
                        : 'multiple areas'}. Keep up the good work!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;