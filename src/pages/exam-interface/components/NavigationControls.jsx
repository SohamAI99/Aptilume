import React from 'react';
import { Button } from '../../../components/ui/Button';

const NavigationControls = ({ 
  currentIndex, 
  totalQuestions, 
  onNavigate, 
  onSubmit 
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={() => onNavigate('prev')}
        disabled={currentIndex === 0}
      >
        Previous
      </Button>
      
      <div className="text-sm text-muted-foreground">
        Question {currentIndex + 1} of {totalQuestions}
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => onNavigate('next')}
          disabled={currentIndex === totalQuestions - 1}
        >
          Next
        </Button>
        
        <Button
          variant="primary"
          onClick={onSubmit}
        >
          Submit Exam
        </Button>
      </div>
    </div>
  );
};

export default NavigationControls;