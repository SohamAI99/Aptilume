import React, { useState } from 'react';
import { removeUnwantedQuizzes } from '../../utils/removeUnwantedQuizzes';
import { forceRemoveUnwantedQuizzes } from '../../utils/forceRemoveUnwantedQuizzes';

const RemoveUnwantedQuizzesButton = () => {
  const [loading, setLoading] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);

  const handleRemoveQuizzes = async () => {
    if (window.confirm('Are you sure you want to remove the unwanted quizzes? This action cannot be undone.')) {
      setLoading(true);
      try {
        const result = await removeUnwantedQuizzes();
        alert(`Successfully removed quizzes: ${result.removedQuizzes.join(', ')}`);
      } catch (error) {
        console.error('Error removing quizzes:', error);
        alert('Error removing quizzes. Check console for details.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForceRemoveQuizzes = async () => {
    if (window.confirm('Are you sure you want to FORCE remove unwanted quizzes? This will remove quizzes with partial title matches and cannot be undone.')) {
      setForceLoading(true);
      try {
        const result = await forceRemoveUnwantedQuizzes();
        alert(`Successfully force removed ${result.count} quizzes: ${result.removedQuizzes.join(', ')}`);
      } catch (error) {
        console.error('Error force removing quizzes:', error);
        alert('Error force removing quizzes. Check console for details.');
      } finally {
        setForceLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleRemoveQuizzes}
        disabled={loading || forceLoading}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Removing...' : 'Remove Unwanted Quizzes'}
      </button>
      <button
        onClick={handleForceRemoveQuizzes}
        disabled={loading || forceLoading}
        className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {forceLoading ? 'Force Removing...' : 'Force Remove Quizzes'}
      </button>
    </div>
  );
};

export default RemoveUnwantedQuizzesButton;