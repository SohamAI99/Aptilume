import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const QuestionReviewSection = ({ resultsData }) => {
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const subjects = ['all', ...new Set(resultsData?.subjects?.map(s => s.name) || [])];
  const statuses = [
    { value: 'all', label: 'All Questions', icon: 'List' },
    { value: 'correct', label: 'Correct', icon: 'CheckCircle' },
    { value: 'incorrect', label: 'Incorrect', icon: 'XCircle' },
    { value: 'unanswered', label: 'Unanswered', icon: 'Circle' }
  ];

  // Filter questions
  const filteredQuestions = resultsData?.questions?.filter(question => {
    const subjectMatch = filterSubject === 'all' || question?.subject === filterSubject;
    let statusMatch = true;
    
    switch (filterStatus) {
      case 'correct':
        statusMatch = question?.isCorrect;
        break;
      case 'incorrect':
        statusMatch = !question?.isCorrect && question?.selectedAnswer !== null;
        break;
      case 'unanswered':
        statusMatch = question?.selectedAnswer === null;
        break;
      default:
        statusMatch = true;
    }
    
    return subjectMatch && statusMatch;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredQuestions?.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions?.slice(startIndex, startIndex + questionsPerPage);

  const toggleQuestionExpansion = (questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(questionId)) {
        newSet?.delete(questionId);
      } else {
        newSet?.add(questionId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (question) => {
    if (question?.selectedAnswer === null) {
      return { name: 'Circle', color: 'text-muted-foreground' };
    }
    return question?.isCorrect 
      ? { name: 'CheckCircle', color: 'text-green-600' }
      : { name: 'XCircle', color: 'text-red-600' };
  };

  const getOptionLabel = (index) => String.fromCharCode(65 + index); // A, B, C, D

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg p-6 shadow-elevation-1 border border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Subject:</span>
            {subjects?.map((subject) => (
              <Button
                key={subject}
                variant={filterSubject === subject ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilterSubject(subject);
                  setCurrentPage(1);
                }}
                className="text-xs"
              >
                {subject === 'all' ? 'All Subjects' : subject}
              </Button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Status:</span>
            {statuses?.map((status) => (
              <Button
                key={status?.value}
                variant={filterStatus === status?.value ? 'default' : 'outline'}
                size="sm"
                iconName={status?.icon}
                iconPosition="left"
                onClick={() => {
                  setFilterStatus(status?.value);
                  setCurrentPage(1);
                }}
                className="text-xs"
              >
                {status?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + questionsPerPage, filteredQuestions?.length)} of {filteredQuestions?.length} questions
          </span>
          
          {/* Expand/Collapse All */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Maximize2"
              onClick={() => setExpandedQuestions(new Set(paginatedQuestions.map(q => q.id)))}
              className="text-xs"
            >
              Expand All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Minimize2"
              onClick={() => setExpandedQuestions(new Set())}
              className="text-xs"
            >
              Collapse All
            </Button>
          </div>
        </div>
      </div>
      {/* Question Cards */}
      <div className="space-y-4">
        {paginatedQuestions?.map((question) => {
          const statusIcon = getStatusIcon(question);
          const isExpanded = expandedQuestions?.has(question?.id);
          
          return (
            <div key={question?.id} className="bg-white rounded-lg shadow-elevation-1 border border-border overflow-hidden">
              {/* Question Header */}
              <div className="p-4 bg-muted/30 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", statusIcon?.color)}>
                      <Icon name={statusIcon?.name} size={20} />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Question {question?.id}</span>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                          {question?.subject}
                        </span>
                        <span className={cn("px-2 py-1 rounded", {
                          "bg-green-100 text-green-700": question?.difficulty === 'Easy',
                          "bg-yellow-100 text-yellow-700": question?.difficulty === 'Medium',
                          "bg-red-100 text-red-700": question?.difficulty === 'Hard'
                        })}>
                          {question?.difficulty}
                        </span>
                        <span>{question?.marks} marks</span>
                        {question?.timeSpent && <span>{question?.timeSpent}s</span>}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                    onClick={() => toggleQuestionExpansion(question?.id)}
                  />
                </div>
              </div>
              {/* Question Content */}
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-foreground font-medium leading-relaxed">
                    {question?.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {question?.options?.map((option, index) => {
                    const isSelected = question?.selectedAnswer === index;
                    const isCorrect = question?.correctAnswer === index;
                    
                    return (
                      <div key={index} className={cn(
                        "p-3 rounded-lg border transition-colors",
                        {
                          "bg-green-50 border-green-200": isCorrect,
                          "bg-red-50 border-red-200": isSelected && !isCorrect,
                          "bg-muted/30 border-border": !isSelected && !isCorrect
                        }
                      )}>
                        <div className="flex items-center space-x-3">
                          <span className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                            {
                              "bg-green-600 border-green-600 text-white": isCorrect,
                              "bg-red-600 border-red-600 text-white": isSelected && !isCorrect,
                              "border-muted-foreground text-muted-foreground": !isSelected && !isCorrect
                            }
                          )}>
                            {getOptionLabel(index)}
                          </span>
                          <span className="text-foreground">{option}</span>
                          <div className="flex items-center space-x-2 ml-auto">
                            {isSelected && <Icon name="User" size={14} className="text-blue-600" title="Your answer" />}
                            {isCorrect && <Icon name="Check" size={14} className="text-green-600" title="Correct answer" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation - Show when expanded */}
                {isExpanded && question?.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          {question?.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg p-4 shadow-elevation-1 border border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              iconPosition="left"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)]?.map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className="w-10 h-10"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconPosition="right"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionReviewSection;