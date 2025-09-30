import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

const TestCard = ({ test, onStartTest }) => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    if (onStartTest) {
      onStartTest(test);
    }
    navigate('/quiz-rules-instructions', { state: { testId: test?.id, test } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'hard':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getCompanyColor = (company) => {
    const colors = {
      'Google': 'bg-blue-100 text-blue-700',
      'Microsoft': 'bg-green-100 text-green-700',
      'Amazon': 'bg-orange-100 text-orange-700',
      'Apple': 'bg-gray-100 text-gray-700',
      'Meta': 'bg-purple-100 text-purple-700',
      'Netflix': 'bg-red-100 text-red-700',
      'FAANG': 'bg-blue-100 text-blue-700',
      'Mango': 'bg-orange-100 text-orange-700'
    };
    return colors[company] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-elevation-2 transition-all duration-200 border border-border">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{test?.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{test?.description}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test?.difficulty)}`}>
            {test?.difficulty}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
            {test?.questionCount} questions
          </span>
          <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
            {test?.duration} min
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getCompanyColor(test?.company)}`}>
            {test?.company}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-muted/30 rounded-lg p-2">
            <div className="text-sm font-semibold text-foreground">{test?.attempts || 0}</div>
            <div className="text-xs text-muted-foreground">Attempts</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2">
            <div className="text-sm font-semibold text-foreground">{test?.avgScore || 0}%</div>
            <div className="text-xs text-muted-foreground">Avg. Score</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-2">
            <div className="text-sm font-semibold text-foreground">{test?.passRate || 0}%</div>
            <div className="text-xs text-muted-foreground">Pass Rate</div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto">
          <Button
            variant="primary"
            onClick={handleStartTest}
            className="w-full"
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Start Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestCard;