import React, { useState } from 'react';
import { addCorrectQuizzes } from '../../utils/addCorrectQuizzes';

const AddCorrectQuizzesButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAddQuizzes = async () => {
    if (window.confirm('Are you sure you want to add the correct quizzes? This will remove any existing quizzes with the same titles and add the correct ones.')) {
      setLoading(true);
      setResult(null);
      try {
        const response = await addCorrectQuizzes();
        if (response.success) {
          setResult({ type: 'success', message: 'Correct quizzes added successfully!' });
        } else {
          setResult({ type: 'error', message: `Error: ${response.error}` });
        }
      } catch (error) {
        console.error('Error adding quizzes:', error);
        setResult({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground">Add Correct Quizzes</h3>
      <p className="text-sm text-muted-foreground">
        This will add the correct quizzes and remove any existing ones with the same titles.
      </p>
      <button
        onClick={handleAddQuizzes}
        disabled={loading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Correct Quizzes'}
      </button>
      {result && (
        <div className={`p-2 rounded text-sm ${result.type === 'success' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default AddCorrectQuizzesButton;