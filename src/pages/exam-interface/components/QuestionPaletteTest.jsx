import React, { useState } from 'react';
import QuestionPalette from './QuestionPalette';

// Sample test questions
const sampleQuestions = [
  { id: '1', text: 'What is 2+2?' },
  { id: '2', text: 'What is the capital of France?' },
  { id: '3', text: 'Which planet is known as the Red Planet?' },
  { id: '4', text: 'What is the largest mammal?' },
  { id: '5', text: 'How many continents are there?' },
  { id: '6', text: 'What is the chemical symbol for gold?' },
  { id: '7', text: 'Who wrote Romeo and Juliet?' },
  { id: '8', text: 'What is the tallest mountain in the world?' },
  { id: '9', text: 'What is the freezing point of water?' },
  { id: '10', text: 'Which element has the chemical symbol O?' }
];

const QuestionPaletteTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions] = useState(new Set([0, 2, 5]));
  const [markedQuestions] = useState(new Set([1, 3]));
  const [visitedQuestions] = useState(new Set([0, 1, 2, 3, 4]));

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    console.log('Selected question:', index);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Question Palette Test</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Content */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-foreground mb-6">
                {sampleQuestions[currentQuestionIndex]?.text || 'No question selected'}
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="option" className="w-4 h-4" />
                    <span>Option A</span>
                  </label>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border border-border">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="option" className="w-4 h-4" />
                    <span>Option B</span>
                  </label>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border border-border">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="option" className="w-4 h-4" />
                    <span>Option C</span>
                  </label>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border border-border">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="option" className="w-4 h-4" />
                    <span>Option D</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                onClick={() => setCurrentQuestionIndex(Math.min(sampleQuestions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === sampleQuestions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
          
          {/* Question Palette */}
          <div>
            <QuestionPalette
              questions={sampleQuestions}
              currentQuestionIndex={currentQuestionIndex}
              answeredQuestions={answeredQuestions}
              markedQuestions={markedQuestions}
              visitedQuestions={visitedQuestions}
              onQuestionSelect={handleQuestionSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaletteTest;