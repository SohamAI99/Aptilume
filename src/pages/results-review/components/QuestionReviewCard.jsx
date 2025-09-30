import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const QuestionReviewCard = ({ question, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (isCorrect) => {
    if (question?.selectedOption === null) return 'text-warning';
    return isCorrect ? 'text-success' : 'text-destructive';
  };

  const getStatusIcon = (isCorrect) => {
    if (question?.selectedOption === null) return Clock;
    return isCorrect ? CheckCircle : XCircle;
  };

  const getStatusBadge = (isCorrect) => {
    const IconComponent = getStatusIcon(isCorrect);
    
    if (question?.selectedOption === null) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
          <IconComponent className="h-3 w-3 mr-1" />
          Unanswered
        </div>
      );
    }
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
      }`}>
        <IconComponent className="h-3 w-3 mr-1" />
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
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      {/* Question Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-medium text-foreground line-clamp-1">
              {question?.questionText}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question?.difficulty)}`}>
                {question?.difficulty}
              </span>
              {getStatusBadge(question?.isCorrect)}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <svg 
            className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-border bg-background/50">
          {/* Options */}
          <div className="space-y-3 mb-4">
            <h4 className="font-medium text-foreground mb-2">Options:</h4>
            {question?.options?.map((option, optIndex) => {
              const isSelected = question?.selectedOption === optIndex;
              const isCorrect = question?.correctOption === optIndex;
              
              let optionStyle = "p-3 rounded-lg border";
              if (isSelected && isCorrect) {
                optionStyle += " bg-success/10 border-success text-success";
              } else if (isSelected && !isCorrect) {
                optionStyle += " bg-destructive/10 border-destructive text-destructive";
              } else if (isCorrect) {
                optionStyle += " bg-success/10 border-success text-success";
              } else {
                optionStyle += " bg-muted border-border";
              }
              
              return (
                <div key={optIndex} className={optionStyle}>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                    <span>{option}</span>
                    {isSelected && (
                      <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Your Answer
                      </span>
                    )}
                    {isCorrect && !isSelected && (
                      <span className="ml-auto text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                        Correct Answer
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {question?.explanation && (
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Explanation
              </h4>
              <p className="text-sm text-foreground">{question?.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionReviewCard;