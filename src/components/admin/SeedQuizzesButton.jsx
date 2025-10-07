import React, { useState } from 'react';
import { seedAllQuizzes } from '../../utils/seedUpdatedQuizzesClient';

const SeedQuizzesButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeedQuizzes = async () => {
    if (window.confirm('Are you sure you want to seed the quizzes? This will delete all existing quizzes and replace them with the sample data.')) {
      setLoading(true);
      setResult(null);
      try {
        const response = await seedAllQuizzes();
        if (response.success) {
          setResult({ type: 'success', message: 'Quizzes seeded successfully!' });
        } else {
          setResult({ type: 'error', message: `Error: ${response.error}` });
        }
      } catch (error) {
        console.error('Error seeding quizzes:', error);
        setResult({ type: 'error', message: `Error: ${error.message}` });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground">Seed Quizzes</h3>
      <p className="text-sm text-muted-foreground">
        This will delete all existing quizzes and replace them with sample data.
      </p>
      <button
        onClick={handleSeedQuizzes}
        disabled={loading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Seeding...' : 'Seed Quizzes'}
      </button>
      {result && (
        <div className={`p-2 rounded text-sm ${result.type === 'success' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default SeedQuizzesButton;