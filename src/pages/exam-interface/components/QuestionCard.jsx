import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

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
                <Icon name="Bookmark" size={12} className="mr-1" />
                Marked
              </span>
            )}
            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
              <Icon name="Clock" size={12} className="inline mr-1" />
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
                    <Icon name="Check" size={16} />
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
                  <Icon name="CheckCircle" size={20} className="text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation Section */}
        {question?.explanation && (
          <div className="mt-6">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-2"
            >
              <Icon 
                name={showExplanation ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="mr-1" 
              />
              {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>
            
            {showExplanation && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border animate-in slide-in-from-top-2 duration-300">
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <Icon name="Lightbulb" size={16} className="mr-2 text-warning" />
                  Explanation
                </h4>
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="glass-card rounded-xl p-4 mt-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            iconName="ArrowLeft"
            iconPosition="left"
            size="sm"
          >
            Previous
          </Button>
          
          <Button
            variant="secondary"
            onClick={onMarkForReview}
            iconName={isMarkedForReview ? "BookmarkCheck" : "Bookmark"}
            iconPosition="left"
            size="sm"
          >
            {isMarkedForReview ? 'Unmark' : 'Mark for Review'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onSaveAndNext}
            disabled={!canGoNext && currentQuestionIndex !== totalQuestions - 1}
            size="sm"
            className="ml-auto"
          >
            Save & Next
          </Button>
          
          <Button
            variant="default"
            onClick={onNext}
            disabled={!canGoNext}
            iconName="ArrowRight"
            iconPosition="right"
            size="sm"
          >
            Next
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;