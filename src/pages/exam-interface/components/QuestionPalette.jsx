import React from 'react';

const QuestionPalette = ({ 
  questions, 
  currentQuestionIndex, 
  answeredQuestions, 
  markedQuestions, 
  visitedQuestions,
  onQuestionSelect,
  className = ""
}) => {
  // Log for debugging
  React.useEffect(() => {
    console.log('QuestionPalette received questions:', questions?.length);
    console.log('Questions data:', questions);
  }, [questions]);

  const getQuestionStatus = (index) => {
    const isAnswered = answeredQuestions?.has(index);
    const isMarked = markedQuestions?.has(index);
    const isVisited = visitedQuestions?.has(index);
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) {
      return 'current';
    } else if (isAnswered && isMarked) {
      return 'answered-marked';
    } else if (isAnswered) {
      return 'answered';
    } else if (isMarked) {
      return 'marked';
    } else if (isVisited) {
      return 'visited';
    } else {
      return 'not-visited';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-200';
      case 'answered-marked':
        return 'bg-purple-600 text-white border-purple-700 relative';
      case 'answered':
        return 'bg-green-500 text-white border-green-600';
      case 'marked':
        return 'bg-purple-500 text-white border-purple-600';
      case 'visited':
        return 'bg-orange-500 text-white border-orange-600';
      case 'not-visited':
      default:
        return 'bg-gray-300 text-gray-700 border-gray-400 hover:bg-gray-400';
    }
  };

  // Filter out invalid questions
  const validQuestions = questions?.filter(q => q && (q.text || q.question || q.id)) || [];
  
  const statusCounts = {
    answered: answeredQuestions?.size || 0,
    marked: markedQuestions?.size || 0,
    visited: (visitedQuestions?.size || 0) - (answeredQuestions?.size || 0),
    notVisited: Math.max(0, (validQuestions?.length || 0) - (visitedQuestions?.size || 0))
  };

  return (
    <div className={`bg-white rounded-lg shadow-elevation-2 h-full flex flex-col ${className}`}>
      {/* Palette Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-4">Question Palette</h3>
        
        {/* Status Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded border"></div>
            <span className="text-muted-foreground">Answered ({statusCounts?.answered})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded border"></div>
            <span className="text-muted-foreground">Marked ({statusCounts?.marked})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded border"></div>
            <span className="text-muted-foreground">Visited ({statusCounts?.visited})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded border"></div>
            <span className="text-muted-foreground">Not Visited ({statusCounts?.notVisited})</span>
          </div>
        </div>
      </div>
      {/* Question Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {validQuestions.length > 0 ? (
          <div className="grid grid-cols-5 gap-2">
            {validQuestions?.map((question, index) => {
              const status = getQuestionStatus(index);
              const styles = getStatusStyles(status);
              
              return (
                <button
                  key={question?.id || index}
                  onClick={() => onQuestionSelect(index)}
                  className={`w-10 h-10 rounded border-2 text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${styles}`}
                  title={`Question ${index + 1} - ${status?.replace('-', ' ')}`}
                >
                  {index + 1}
                  {status === 'answered-marked' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-destructive text-3xl mb-2">⚠️</div>
            <p className="text-muted-foreground">No valid questions found</p>
          </div>
        )}
      </div>
      {/* Palette Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Progress: {answeredQuestions?.size || 0} of {validQuestions?.length || 0} answered
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${validQuestions?.length ? Math.max(0, ((answeredQuestions?.size || 0) / validQuestions?.length) * 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;