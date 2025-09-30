import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Bookmark, Clock, Check, CheckCircle } from 'lucide-react';

const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  onSaveAndNext,
  onMarkForReview,
  isMarkedForReview,
  canGoPrevious,
  canGoNext,
  currentQuestionIndex,
  totalQuestions
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Log question data for debugging
  useEffect(() => {
    console.log('QuestionCard received question:', question);
    console.log('Current question index:', currentQuestionIndex);
    console.log('Total questions:', totalQuestions);
  }, [question, currentQuestionIndex, totalQuestions]);

  // Track time spent on question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleOptionSelect = (optionIndex) => {
    onAnswerSelect(optionIndex);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Ensure question data is properly structured
  const getQuestionText = () => {
    if (!question) return 'No question data available';
    return question?.text || question?.question || 'No question text available';
  };

  const getQuestionOptions = () => {
    if (!question) return ['Option A', 'Option B', 'Option C', 'Option D'];
    
    // Handle different data structures for options
    if (Array.isArray(question?.options)) {
      return question.options;
    } else if (typeof question?.options === 'object' && question.options !== null) {
      // Convert object to array
      return Object.values(question.options);
    } else if (question?.options) {
      // If it's a single value, make it an array
      return [question.options];
    }
    return ['Option A', 'Option B', 'Option C', 'Option D']; // Default options
  };

  const getQuestionCategory = () => {
    if (!question) return 'General Aptitude';
    return question?.category || question?.topic || 'General Aptitude';
  };

  const getQuestionDifficulty = () => {
    if (!question) return 'Medium';
    return question?.difficulty || 'Medium';
  };

  // Check if we have a valid question
  const isValidQuestion = question && (question.text || question.question) && Array.isArray(getQuestionOptions()) && getQuestionOptions().length > 0;

  if (!isValidQuestion) {
    return (
      <div className="h-full flex flex-col">
        <div className="glass-card rounded-xl p-6 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-destructive text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Invalid Question Data</h3>
            <p className="text-muted-foreground mb-4">
              This question doesn't have valid data. Please contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Question Header */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(getQuestionDifficulty())}`}>
                {getQuestionDifficulty()}
              </span>
              <span className="text-xs text-muted-foreground">
                {getQuestionCategory()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isMarkedForReview && (
              <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full font-medium flex items-center">
                <Bookmark className="h-3 w-3 mr-1" />
                Marked
              </span>
            )}
            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
              <Clock className="h-3 w-3 inline mr-1" />
              {formatTime(timeSpent)}
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 glass-card rounded-xl p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xl font-medium text-foreground mb-4 leading-relaxed">
            {getQuestionText()}
          </h3>
          
          {question?.image && (
            <div className="mb-6">
              <img 
                src={question.image} 
                alt="Question diagram" 
                className="max-w-full h-auto rounded-lg border border-border mx-auto"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {getQuestionOptions()?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                selectedAnswer === index
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center mr-4 ${
                  selectedAnswer === index
                    ? 'border-primary bg-primary text-white'
                    : 'border-border'
                }`}>
                  {selectedAnswer === index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">
                    {typeof option === 'string' ? option : JSON.stringify(option)}
                  </span>
                </div>
                {selectedAnswer === index && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation (if available and toggled) */}
        {showExplanation && question?.explanation && (
          <div className="glass-card rounded-lg p-4 mb-6 border border-success/20 bg-success/5">
            <h4 className="font-medium text-success mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Explanation
            </h4>
            <p className="text-foreground text-sm">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={onMarkForReview}
          >
            {isMarkedForReview ? 'Unmark' : 'Mark for Review'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </Button>
          
          <div className="flex-1"></div>
          
          <Button
            variant="outline"
            onClick={onSaveAndNext}
            disabled={!canGoNext && currentQuestionIndex < totalQuestions - 1}
          >
            Save & Next
          </Button>
          
          <Button
            variant="primary"
            onClick={onNext}
            disabled={!canGoNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;