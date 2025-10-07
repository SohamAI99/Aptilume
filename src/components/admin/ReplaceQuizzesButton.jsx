import React, { useState } from 'react';
import { replaceQuizzes } from '../../utils/replaceQuizzesClient';

const ReplaceQuizzesButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleReplaceQuizzes = async () => {
    if (window.confirm('Are you sure you want to replace all quizzes? This will delete all existing quizzes and replace them with the correct data.')) {
      setLoading(true);
      setResult(null);
      try {
        const response = await replaceQuizzes();
        if (response.success) {
          setResult({ type: 'success', message: 'Quizzes replaced successfully!' });
        } else {
          setResult({ type: 'error', message: `Error: ${response.error}` });
        }
      } catch (error) {
        console.error('Error replacing quizzes:', error);
        setResult({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground">Replace Quizzes</h3>
      <p className="text-sm text-muted-foreground">
        This will delete all existing quizzes and replace them with the correct data.
      </p>
      <button
        onClick={handleReplaceQuizzes}
        disabled={loading}
        className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Replacing...' : 'Replace Quizzes'}
      </button>
      {result && (
        <div className={`p-2 rounded text-sm ${result.type === 'success' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default ReplaceQuizzesButton;