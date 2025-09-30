import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { X, AlertCircle, Loader2, Check } from 'lucide-react';

const SubmitConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  examTitle,
  answeredCount,
  totalQuestions,
  markedCount,
  timeRemaining
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, you might want to verify a password here
      // For now, we'll just proceed with submission
      await onConfirm(password);
    } catch (err) {
      setError(err.message || 'Failed to submit exam. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Submit Exam</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="h-4 w-4" />}
              onClick={onClose}
              className="p-2"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Exam Info */}
          <div className="mb-6">
            <h3 className="font-medium text-foreground mb-2">{examTitle}</h3>
            <p className="text-sm text-muted-foreground">
              You're about to submit your exam. Please review your answers before proceeding.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium text-foreground mb-3">Exam Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Questions:</span>
                <span className="font-medium text-foreground">{totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Answered:</span>
                <span className="font-medium text-green-600">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Unanswered:</span>
                <span className="font-medium text-orange-600">{totalQuestions - answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Marked:</span>
                <span className="font-medium text-purple-600">{markedCount}</span>
              </div>
              <div className="flex items-center justify-between col-span-2">
                <span className="text-muted-foreground">Time Remaining:</span>
                <span className="font-medium text-foreground font-mono">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Submission Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter submission password"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter the password provided by your invigilator to submit the exam.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center text-destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1"
              icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              iconPosition="left"
            >
              {isLoading ? 'Submitting...' : 'Submit Exam'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;