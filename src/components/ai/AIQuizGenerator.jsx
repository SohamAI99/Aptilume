import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import * as authService from '../../utils/authService';
import { createQuiz } from '../../utils/dbService';
import aiService from '../../utils/aiService';

const AIQuizGenerator = ({ onQuizGenerated, onCancel }) => {
  const [quizParams, setQuizParams] = useState({
    topic: '',
    difficulty: 'Medium',
    questionCount: 10
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleParamChange = (field, value) => {
    setQuizParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateQuiz = async () => {
    if (!quizParams.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    if (quizParams.questionCount < 1 || quizParams.questionCount > 50) {
      setError('Question count must be between 1 and 50');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Generate quiz using AI service
      const result = await aiService.generateQuiz({
        topic: quizParams.topic,
        difficulty: quizParams.difficulty,
        count: parseInt(quizParams.questionCount)
      });

      // Create quiz structure
      const user = await authService.getCurrentUser();
      const quizPayload = {
        title: `${quizParams.topic} Quiz`,
        description: `AI-generated quiz on ${quizParams.topic}`,
        difficulty: quizParams.difficulty,
        duration: parseInt(quizParams.questionCount) * 2, // 2 minutes per question
        questionCount: parseInt(quizParams.questionCount),
        category: 'AI Generated',
        tags: [quizParams.topic, 'AI Generated'],
        isPublished: false,
        isRecommended: false,
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0
        },
        questions: result.questions
      };

      setGeneratedQuiz(quizPayload);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!generatedQuiz) return;

    try {
      // Create quiz in Firestore
      const quizId = await createQuiz(generatedQuiz);
      
      // Notify parent component
      onQuizGenerated?.(quizId, generatedQuiz);
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError('Failed to create quiz. Please try again.');
    }
  };

  const handleRegenerate = () => {
    setGeneratedQuiz(null);
    setError('');
  };

  return (
    <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            AI Quiz Generator
          </h2>
          <button 
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {error && (
          <div className="glass-card rounded-lg p-3 mb-4 bg-error/10 border border-error">
            <div className="flex items-center text-error">
              <Icon name="AlertCircle" size={16} className="mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {!generatedQuiz ? (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Topic *</label>
                <Input
                  value={quizParams.topic}
                  onChange={(e) => handleParamChange('topic', e.target.value)}
                  placeholder="e.g., JavaScript, Data Structures, Aptitude"
                  fullWidth
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <Select
                    value={quizParams.difficulty}
                    onChange={(e) => handleParamChange('difficulty', e.target.value)}
                    options={[
                      { value: 'Easy', label: 'Easy' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Hard', label: 'Hard' }
                    ]}
                    fullWidth
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Questions</label>
                  <Input
                    type="number"
                    value={quizParams.questionCount}
                    onChange={(e) => handleParamChange('questionCount', parseInt(e.target.value))}
                    min="1"
                    max="50"
                    fullWidth
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateQuiz} 
                disabled={isGenerating}
                iconName={isGenerating ? "Loader2" : "Sparkles"}
              >
                {isGenerating ? 'Generating...' : 'Generate Quiz'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Generated Quiz Preview</h3>
              <div className="glass-card rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{generatedQuiz.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    generatedQuiz.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                    generatedQuiz.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                    'bg-error/20 text-error'
                  }`}>
                    {generatedQuiz.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{generatedQuiz.description}</p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center">
                    <Icon name="Clock" size={16} className="mr-1" />
                    {generatedQuiz.duration} min
                  </div>
                  <div className="flex items-center">
                    <Icon name="HelpCircle" size={16} className="mr-1" />
                    {generatedQuiz.questionCount} questions
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Questions Preview</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {generatedQuiz.questions.slice(0, 3).map((question, index) => (
                  <div key={question.id} className="glass-card rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-medium">Q{index + 1}:</span> {question.question}
                    </p>
                  </div>
                ))}
                {generatedQuiz.questions.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground">
                    + {generatedQuiz.questions.length - 3} more questions
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleRegenerate}>
                Regenerate
              </Button>
              <Button onClick={handleCreateQuiz} iconName="PlusCircle">
                Create Quiz
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIQuizGenerator;