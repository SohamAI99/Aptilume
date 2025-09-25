import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

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
    return colors?.[company] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {test?.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {test?.description}
          </p>
        </div>
        {test?.isNew && (
          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium border border-primary/30">
            New
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {test?.companies?.map((company, index) => (
          <span
            key={index}
            className={`text-xs px-2 py-1 rounded-full font-medium ${getCompanyColor(company)} border border-border/60`}
          >
            {company}
          </span>
        ))}
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(test?.difficulty)} border border-border/60`}>
          {test?.difficulty}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
          </div>
          <div className="text-sm font-medium text-foreground">{test?.duration}</div>
          <div className="text-xs text-muted-foreground">Duration</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="FileText" size={16} className="text-muted-foreground" />
          </div>
          <div className="text-sm font-medium text-foreground">{test?.questionCount}</div>
          <div className="text-xs text-muted-foreground">Questions</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Users" size={16} className="text-muted-foreground" />
          </div>
          <div className="text-sm font-medium text-foreground">{test?.attempts}</div>
          <div className="text-xs text-muted-foreground">Attempts</div>
        </div>
      </div>
      {test?.deadline && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
          <Icon name="AlertCircle" size={16} className="text-warning" />
          <span className="text-sm text-warning font-medium">
            Deadline: {new Date(test.deadline)?.toLocaleDateString()}
          </span>
        </div>
      )}
      <Button
        variant="gradient"
        fullWidth
        iconName="Play"
        iconPosition="left"
        onClick={handleStartTest}
        className="font-medium"
      >
        Start Test
      </Button>
    </div>
  );
};

export default TestCard;