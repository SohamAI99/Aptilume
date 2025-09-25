import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AttemptCard = ({ attempt }) => {
  const navigate = useNavigate();

  const handleViewResults = () => {
    // Navigate to results page with attempt data
    navigate('/results-review', { 
      state: {
        attemptId: attempt?.id,
        examId: attempt?.testId,
        examTitle: attempt?.testTitle,
        totalQuestions: attempt?.totalQuestions,
        correctAnswers: attempt?.correctAnswers,
        score: attempt?.score,
        timeTaken: attempt?.timeTaken,
        submittedAt: attempt?.completedAt,
        percentile: attempt?.percentile,
        rank: attempt?.rank,
        status: attempt?.status
      }
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'incomplete':
        return { name: 'Clock', color: 'text-warning' };
      case 'failed':
        return { name: 'XCircle', color: 'text-destructive' };
      default:
        return { name: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const statusIcon = getStatusIcon(attempt?.status);

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-elevation-2 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {attempt?.testTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>{new Date(attempt.completedAt)?.toLocaleDateString()}</span>
            <Icon name="Clock" size={14} />
            <span>{attempt?.timeTaken}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon name={statusIcon?.name} size={20} className={statusIcon?.color} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className={`text-2xl font-bold ${getScoreColor(attempt?.score)}`}>
            {attempt?.score}%
          </div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {attempt?.correctAnswers}/{attempt?.totalQuestions}
          </div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Target" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Rank: {attempt?.rank || 'N/A'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Percentile: {attempt?.percentile || 'N/A'}
          </span>
        </div>
      </div>
      {attempt?.status === 'completed' && (
        <Button
          variant="outline"
          fullWidth
          iconName="Eye"
          iconPosition="left"
          onClick={handleViewResults}
        >
          View Results
        </Button>
      )}
      {attempt?.status === 'incomplete' && (
        <Button
          variant="default"
          fullWidth
          iconName="RotateCcw"
          iconPosition="left"
          onClick={() => navigate('/quiz-rules-instructions', { state: { testId: attempt?.testId } })}
        >
          Resume Test
        </Button>
      )}
    </div>
  );
};

export default AttemptCard;