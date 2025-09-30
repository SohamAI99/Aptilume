import React from 'react';

const AuthHeader = ({ activeTab }) => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
          <img src="/logo.png" alt="AptiLume" className="h-6 w-6 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">AptiLume</h1>
      </div>
      
      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          {activeTab === 'login' ? 'Welcome Back!' : 'Join AptiLume'}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {activeTab === 'login' ?'Sign in to access your personalized aptitude testing dashboard and track your progress.' :'Create your account to start your journey with AI-powered aptitude testing and skill assessment.'
          }
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;