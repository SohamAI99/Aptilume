import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AdminAIAssistance = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call the backend AI service
      // For now, we'll simulate with a more realistic response
      const response = await fetch('/api/ai/explain-concept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concept: prompt,
          level: 'intermediate'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResponse(`Based on your request about "${prompt}", here's what I suggest:\n\n${data.data.explanation}\n\nKey Examples:\n${data.data.examples.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}\n\nWould you like me to generate a quiz on this topic?`);
      } else {
        setResponse(`I couldn't generate suggestions for "${prompt}". Please try rephrasing your request.`);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setResponse(`Based on your request about "${prompt}", here's what I suggest:\n\n1. Create a structured quiz with 10-15 questions\n2. Include a mix of multiple choice and short answer questions\n3. Focus on core concepts first, then advanced topics\n4. Set time limit of 30-45 minutes\n\nWould you like me to generate this quiz for you?`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'generate'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Sparkles" size={16} className="inline mr-2" />
            AI Assistant
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'history'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="History" size={16} className="inline mr-2" />
            History
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'generate' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                How can I help you create better quizzes?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a quiz on JavaScript closures for intermediate developers..."
                rows={4}
                className="w-full glass-card border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Get AI Suggestions
                </>
              )}
            </Button>

            {response && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Sparkles" size={16} className="text-accent mt-1 flex-shrink-0" />
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-sm">{response}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
            <p className="text-muted-foreground">
              Your AI assistance history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAIAssistance;