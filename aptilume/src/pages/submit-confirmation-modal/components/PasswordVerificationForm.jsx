import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PasswordVerificationForm = ({
  password,
  onPasswordChange,
  error,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Security Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Security Verification Required</p>
            <p className="text-sm text-blue-700">
              Enter your account password to confirm exam submission. This ensures only you can submit your exam.
            </p>
          </div>
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Input
          type="password"
          label="Account Password"
          placeholder="Enter your login password"
          value={password}
          onChange={(e) => onPasswordChange(e?.target?.value)}
          error={error}
          required
          disabled={isSubmitting}
          className="text-base"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Use the same password you used to log into your account
        </p>
      </div>

      {/* Real-time Validation Feedback */}
      {password && !error && (
        <div className="flex items-center space-x-2 text-green-600">
          <Icon name="Check" size={16} />
          <span className="text-sm">Password format valid</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Return to Exam
        </Button>
        
        <Button
          type="submit"
          variant="destructive"
          loading={isSubmitting}
          disabled={!password?.trim() || isSubmitting}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Submitting Exam...
            </>
          ) : (
            <>
              <Icon name="Send" size={16} className="mr-2" />
              Submit Final Answers
            </>
          )}
        </Button>
      </div>

      {/* Progress Indicator */}
      {isSubmitting && (
        <div className="mt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Icon name="Clock" size={14} />
            <span>Processing submission...</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </form>
  );
};

export default PasswordVerificationForm;