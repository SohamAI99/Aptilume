import React from 'react';
import { Button } from '../../../components/ui/Button';
import { X } from 'lucide-react';
import QuestionPalette from './QuestionPalette';

const MobilePaletteModal = ({ 
  isOpen, 
  onClose, 
  questions,
  currentQuestionIndex,
  answeredQuestions,
  markedQuestions,
  visitedQuestions,
  onQuestionSelect
}) => {
  const handleQuestionSelect = (index) => {
    onQuestionSelect(index);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="absolute inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-elevation-3 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Question Palette</h2>
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
          />
        </div>

        {/* Palette Content */}
        <div className="flex-1 overflow-hidden">
          <QuestionPalette
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={answeredQuestions}
            markedQuestions={markedQuestions}
            visitedQuestions={visitedQuestions}
            onQuestionSelect={handleQuestionSelect}
            className="h-full border-0 shadow-none rounded-none"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <Button
            variant="default"
            fullWidth
            onClick={onClose}
          >
            Close Palette
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilePaletteModal;