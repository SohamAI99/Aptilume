import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AIQuizGenerator = ({ onQuizGenerated, onCancel }) => {
  const [step, setStep] = useState(1); // 1: topic, 2: difficulty, 3: count, 4: generating, 5: complete
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setStep(4); // Generating step
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setStep(5); // Complete step
      
      // Mock generated quiz data
      const mockQuiz = {
        title: `${topic} Quiz`,
        description: `AI-generated quiz on ${topic}`,
        difficulty,
        questionCount,
        duration: questionCount * 2, // 2 minutes per question
        topics: [topic],
        isPublished: false,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user-id'
      };
      
      // Simulate quiz ID
      const quizId = 'generated-quiz-' + Date.now();
      
      setTimeout(() => {
        onQuizGenerated(quizId, mockQuiz);
      }, 1000);
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">What topic would you like to quiz yourself on?</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., JavaScript, Data Structures, Mathematics..."
                className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={onCancel}>Cancel</Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!topic.trim()}
              >
                Next
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-3 rounded-lg border transition-colors ${
                      difficulty === level
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium capitalize">{level}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {level === 'easy' && 'Beginner friendly'}
                      {level === 'medium' && 'Moderate challenge'}
                      {level === 'hard' && 'Advanced concepts'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                How many questions? ({questionCount} questions)
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5</span>
                <span>50</span>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleGenerate}>Generate Quiz</Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Icon name="Sparkles" size={24} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generating Your Quiz</h3>
            <p className="text-muted-foreground mb-4">
              Our AI is creating {questionCount} {difficulty} questions on {topic}...
            </p>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: isGenerating ? '70%' : '100%' }}
              ></div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
              <Icon name="Check" size={24} className="text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quiz Generated Successfully!</h3>
            <p className="text-muted-foreground mb-4">
              Your AI-generated quiz on {topic} is ready to take.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="ghost" onClick={onCancel}>Close</Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-2xl w-full max-w-md">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {step < 4 ? 'AI Quiz Generator' : step === 4 ? 'Generating...' : 'Complete!'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <Icon name="X" size={20} />
        </Button>
      </div>
      <div className="p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default AIQuizGenerator;