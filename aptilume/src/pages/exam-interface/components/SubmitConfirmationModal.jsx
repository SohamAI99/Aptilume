import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!password?.trim()) {
      setError('Password is required to submit the exam');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Mock password verification - in real app, this would be API call
      if (password !== 'student123') {
        throw new Error('Incorrect password. Please enter your login password.');
      }

      await onConfirm(password);
    } catch (err) {
      setError(err?.message || 'Failed to submit exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-elevation-3 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={24} className="text-warning" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Submit Exam</h2>
                <p className="text-sm text-muted-foreground">{examTitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Exam Summary */}
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

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning mb-1">Important Notice</p>
                <p className="text-sm text-muted-foreground">
                  Once you submit the exam, you cannot make any changes. Please review your answers before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Password Verification */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              label="Enter your login password to confirm submission"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e?.target?.value);
                setError('');
              }}
              error={error}
              required
              disabled={isSubmitting}
              className="mb-4"
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                loading={isSubmitting}
                iconName="CheckCircle"
                iconPosition="left"
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;