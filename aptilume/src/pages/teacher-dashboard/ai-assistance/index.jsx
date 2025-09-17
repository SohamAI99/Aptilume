import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AIQuizGenerator from '../../../components/ai/AIQuizGenerator';

const AIAssistance = () => {
  const [activeTab, setActiveTab] = useState('quiz-generator');
  const [isAIQuizGeneratorOpen, setIsAIQuizGeneratorOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const aiTools = [
    {
      id: 'quiz-generator',
      name: 'Quiz Generator',
      icon: 'Sparkles',
      description: 'Generate quizzes on any topic with AI'
    },
    {
      id: 'content-explainer',
      name: 'Content Explainer',
      icon: 'BookOpen',
      description: 'Get detailed explanations of complex topics'
    },
    {
      id: 'question-analyzer',
      name: 'Question Analyzer',
      icon: 'HelpCircle',
      description: 'Analyze and improve your quiz questions'
    },
    {
      id: 'student-insights',
      name: 'Student Insights',
      icon: 'Users',
      description: 'Get insights on student performance patterns'
    }
  ];

  const handleGenerateResponse = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsGenerating(false);
      setAiResponse(`I can help you with "${prompt}". This is a simulated AI response that would provide detailed assistance based on your request. In a real implementation, this would connect to an AI service to provide personalized assistance for your teaching needs.`);
    }, 1500);
  };

  const handleQuizGenerated = (quizId, quiz) => {
    console.log('AI Quiz generated:', quizId, quiz);
    setIsAIQuizGeneratorOpen(false);
    // In a real app, this would save the quiz to the database
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">AI Assistance</h1>
              <p className="text-muted-foreground mt-1">
                Leverage AI to enhance your teaching and quiz creation
              </p>
            </div>

            {/* AI Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {aiTools.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`glass-card rounded-2xl p-6 cursor-pointer transition-all ${
                    activeTab === tool.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon name={tool.icon} size={20} className="text-primary" />
                    </div>
                    <h3 className="font-semibold">{tool.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              ))}
            </div>

            {/* Tool Content */}
            <div className="glass-card rounded-2xl p-6">
              {activeTab === 'quiz-generator' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="Sparkles" size={24} className="text-primary" />
                    <h2 className="text-xl font-bold">AI Quiz Generator</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Create custom quizzes in seconds with our AI-powered quiz generator. Simply provide a topic, difficulty level, and number of questions.
                  </p>
                  <Button onClick={() => setIsAIQuizGeneratorOpen(true)} iconName="Sparkles">
                    Generate Quiz with AI
                  </Button>
                </div>
              )}

              {activeTab === 'content-explainer' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="BookOpen" size={24} className="text-accent" />
                    <h2 className="text-xl font-bold">Content Explainer</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Get detailed explanations of complex topics to help improve your teaching materials.
                  </p>
                  <div className="space-y-4">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the topic you'd like explained..."
                      className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleGenerateResponse} 
                        disabled={!prompt.trim() || isGenerating}
                        iconName="Send"
                      >
                        {isGenerating ? 'Generating...' : 'Explain'}
                      </Button>
                    </div>
                    {aiResponse && (
                      <div className="glass-card border border-border rounded-lg p-4 mt-4">
                        <h3 className="font-medium mb-2">AI Response:</h3>
                        <p className="text-muted-foreground">{aiResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'question-analyzer' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="HelpCircle" size={24} className="text-warning" />
                    <h2 className="text-xl font-bold">Question Analyzer</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Analyze and improve your quiz questions with AI-powered suggestions.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-8 text-center">
                    <Icon name="HelpCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Question Analyzer Coming Soon</h3>
                    <p className="text-muted-foreground">
                      This feature will help you analyze and improve your quiz questions with AI-powered suggestions.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'student-insights' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="Users" size={24} className="text-success" />
                    <h2 className="text-xl font-bold">Student Insights</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Get insights on student performance patterns and personalized recommendations.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-8 text-center">
                    <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Student Insights Coming Soon</h3>
                    <p className="text-muted-foreground">
                      This feature will provide insights on student performance patterns and personalized recommendations.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isAIQuizGeneratorOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AIQuizGenerator
            onQuizGenerated={handleQuizGenerated}
            onCancel={() => setIsAIQuizGeneratorOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AIAssistance;