import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActionButtons = ({ testData, onProceed }) => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);

  const sampleQuestions = [
    {
      id: 1,
      question: "What is the time complexity of binary search algorithm?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctAnswer: 1,
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "Which data structure uses LIFO (Last In First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      difficulty: "Easy"
    },
    {
      id: 3,
      question: "In a distributed system, what does CAP theorem state?",
      options: [
        "Consistency, Availability, Partition tolerance - pick any two",
        "All three can be achieved simultaneously",
        "Only one property can be guaranteed",
        "CAP theorem doesn't apply to modern systems"
      ],
      correctAnswer: 0,
      difficulty: "Medium"
    }
  ];

  const handleProceed = () => {
    if (!isAgreed) {
      alert('Please acknowledge that you understand the rules and requirements.');
      return;
    }
    // Only call the onProceed callback, don't navigate directly
    onProceed?.();
  };

  const handleBackToDashboard = () => {
    navigate('/student-dashboard');
  };

  const SampleQuestionsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-elevation-3 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Sample Questions</h3>
            <button
              onClick={() => setShowSampleModal(false)}
              className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {sampleQuestions?.map((q, index) => (
              <div key={q?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Question {index + 1}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    q?.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                    q?.difficulty === 'Medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                  }`}>
                    {q?.difficulty}
                  </span>
                </div>
                
                <p className="text-foreground mb-4">{q?.question}</p>
                
                <div className="space-y-2">
                  {q?.options?.map((option, optIndex) => (
                    <div 
                      key={optIndex} 
                      className={`p-3 rounded-lg border ${
                        optIndex === q?.correctAnswer 
                          ? 'border-success bg-success/10 text-success' :'border-border bg-muted/20'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="text-sm">{option}</span>
                        {optIndex === q?.correctAnswer && (
                          <Icon name="Check" size={16} className="text-success ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-border">
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => setShowSampleModal(false)}
          >
            Close Sample Questions
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="glass-card rounded-2xl p-6">
        {/* Agreement Checkbox */}
        <div className="mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e?.target?.checked)}
              className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
            <div className="text-sm">
              <p className="text-foreground font-medium mb-1">
                I understand and agree to the test rules and requirements
              </p>
              <p className="text-muted-foreground text-xs">
                By checking this box, you confirm that you have read all instructions, 
                understand the proctoring requirements, and agree to the single-attempt policy.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={handleBackToDashboard}
            className="sm:w-auto"
          >
            Back to Dashboard
          </Button>
          
          <Button
            variant="secondary"
            iconName="Eye"
            iconPosition="left"
            onClick={() => setShowSampleModal(true)}
            className="sm:w-auto"
          >
            View Sample Questions
          </Button>
          
          <Button
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={handleProceed}
            disabled={!isAgreed}
            className="sm:flex-1"
          >
            I Understand, Proceed to Test
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Next Step</p>
              <p className="text-xs text-muted-foreground mt-1">
                You'll be asked to re-enter your login password for security verification before starting the exam.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Sample Questions Modal */}
      {showSampleModal && <SampleQuestionsModal />}
    </>
  );
};

export default ActionButtons;