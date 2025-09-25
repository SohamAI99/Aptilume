import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionReviewCard = ({ question, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (isCorrect) => {
    if (question?.selectedOption === null) return 'text-warning';
    return isCorrect ? 'text-success' : 'text-destructive';
  };

  const getStatusIcon = (isCorrect) => {
    if (question?.selectedOption === null) return 'Clock';
    return isCorrect ? 'CheckCircle' : 'XCircle';
  };

  const getStatusBadge = (isCorrect) => {
    if (question?.selectedOption === null) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
          <Icon name="Clock" size={12} className="mr-1" />
          Unanswered
        </div>
      );
    }
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
      }`}>
        <Icon name={getStatusIcon(isCorrect)} size={12} className="mr-1" />
        {isCorrect ? 'Correct' : 'Incorrect'}
      </div>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-border/20 overflow-hidden hover:shadow-elevation-2 transition-all duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                {getStatusBadge(question?.isCorrect)}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question?.difficulty)}`}>
                  {question?.difficulty}
                </div>
              </div>
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2 leading-relaxed">
              {question?.question}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="BookOpen" size={14} />
                <span>{question?.subject}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{question?.timeSpent}s</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-border/20">
            {/* Answer Options */}
            <div className="space-y-2">
              <h5 className="font-medium text-foreground text-sm">Answer Options:</h5>
              {question?.options?.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`p-3 rounded-lg border transition-colors ${
                    optionIndex === question?.correctOption
                      ? 'bg-success/10 border-success/20 text-success'
                      : optionIndex === question?.selectedOption && !question?.isCorrect
                      ? 'bg-destructive/10 border-destructive/20 text-destructive' :'bg-muted/20 border-border/20 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-xs">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="text-sm">{option}</span>
                    {optionIndex === question?.correctOption && (
                      <Icon name="CheckCircle" size={16} className="text-success" />
                    )}
                    {optionIndex === question?.selectedOption && !question?.isCorrect && (
                      <Icon name="XCircle" size={16} className="text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Your Answer */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-foreground">Your Answer:</span>
                <Icon 
                  name={getStatusIcon(question?.isCorrect)} 
                  size={16} 
                  className={getStatusColor(question?.isCorrect)} 
                />
              </div>
              <span className="text-sm text-foreground">
                {question?.selectedOption !== null 
                  ? `${String.fromCharCode(65 + question?.selectedOption)} - ${question?.options?.[question?.selectedOption]}`
                  : 'No answer selected'
                }
              </span>
            </div>

            {/* Correct Answer */}
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="font-medium text-sm text-success">Correct Answer:</span>
              </div>
              <span className="text-sm text-foreground">
                {String.fromCharCode(65 + question?.correctOption)} - {question?.options?.[question?.correctOption]}
              </span>
            </div>

            {/* Explanation */}
            {question?.explanation && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm text-blue-800 mb-1 block">Explanation:</span>
                    <p className="text-sm text-blue-700 leading-relaxed">{question?.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionReviewCard;