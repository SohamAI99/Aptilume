import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, TrendingUp, Clock, Target, AlertTriangle } from 'lucide-react';

const OverviewSection = ({ resultsData }) => {
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  // Calculate summary statistics
  const totalQuestions = resultsData?.questions?.length || 0;
  const correctAnswers = resultsData?.questions?.filter(q => q?.isCorrect)?.length || 0;
  const incorrectAnswers = resultsData?.questions?.filter(q => !q?.isCorrect && q?.selectedAnswer !== null)?.length || 0;
  const unanswered = resultsData?.questions?.filter(q => q?.selectedAnswer === null)?.length || 0;
  
  // Get violations from location state or resultsData
  const violations = resultsData?.violations || [];

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

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Questions',
      value: totalQuestions,
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Accuracy',
      value: totalQuestions > 0 ? `${Math.round((correctAnswers / totalQuestions) * 100)}%` : '0%',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-success/10 text-success'
    },
    {
      title: 'Time Taken',
      value: `${resultsData?.timeTaken || 0} min`,
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-warning/10 text-warning'
    },
    {
      title: 'Rank',
      value: `#${resultsData?.rank || '-'}`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-secondary/10 text-secondary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Violations Section */}
      {violations.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-warning mr-2" />
            Proctoring Violations
          </h3>
          <div className="space-y-3">
            {violations.map((violation, index) => (
              <div key={index} className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex justify-between">
                  <span className="font-medium text-warning">{violation.type}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(violation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-1">{violation.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              This exam had {violations.length} proctoring violation(s). This may affect your results.
            </p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Accuracy Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Subject Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#8B5CF6" name="Percentage" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;