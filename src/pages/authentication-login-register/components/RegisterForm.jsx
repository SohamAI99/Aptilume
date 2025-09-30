import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RegisterForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student' // Default to student
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      // In a real app, you'd show this error to the user
      console.error('Passwords do not match');
      return;
    }
    
    // Remove confirmPassword before submitting
    const { confirmPassword, ...submitData } = formData;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-error/10 border border-error/20 text-error rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Full Name"
        id="fullName"
        name="fullName"
        type="text"
        required
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
      />
      
      <Input
        label="Email Address"
        id="email"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />
      
      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a password"
        minLength={6}
      />
      
      <Input
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        minLength={6}
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">User Type</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'student' }))}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              formData.userType === 'student'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'teacher' }))}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              formData.userType === 'teacher'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            Teacher
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'admin' }))}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              formData.userType === 'admin'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        loading={loading} 
        fullWidth
        className="mt-4"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;