import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, Bell, Lock, User, Globe, Clock, Hash, Eye, EyeOff } from 'lucide-react';
import Button from '../../../components/ui/Button';

const StudentSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock }
  ];

  const [settings, setSettings] = useState({
    // General settings
    language: 'en',
    timezone: 'UTC',
    theme: 'light',
    
    // Security settings
    twoFactor: false,
    passwordExpiry: 90,
    
    // Notification settings
    emailNotifications: true,
    quizReminders: true,
    resultNotifications: true,
    
    // Privacy settings
    showActivity: true,
    shareProfile: false,
    allowRecommendations: true
  });

  const handleSave = () => {
    // Save settings logic would go here
    console.log('Settings saved:', settings);
    // Show success message
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleChange('theme', theme)}
                    className={`p-4 border rounded-lg text-center ${
                      settings.theme === theme
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div className="capitalize font-medium text-foreground">{theme}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button
                variant={settings.twoFactor ? "success" : "outline"}
                onClick={() => handleChange('twoFactor', !settings.twoFactor)}
              >
                {settings.twoFactor ? 'Enabled' : 'Enable'}
              </Button>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="font-medium text-foreground mb-2">Password Expiry</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Require password change every
              </p>
              <select
                value={settings.passwordExpiry}
                onChange={(e) => handleChange('passwordExpiry', parseInt(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
              </select>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email' },
              { id: 'quizReminders', label: 'Quiz Reminders', description: 'Get reminders before scheduled quizzes' },
              { id: 'resultNotifications', label: 'Result Notifications', description: 'Be notified when results are available' }
            ].map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div>
                  <h3 className="font-medium text-foreground">{notification.label}</h3>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Button
                  variant={settings[notification.id] ? "success" : "outline"}
                  onClick={() => handleChange(notification.id, !settings[notification.id])}
                >
                  {settings[notification.id] ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        );
      
      case 'privacy':
        return (
          <div className="space-y-4">
            {[
              { id: 'showActivity', label: 'Show Activity', description: 'Display your activity to other users' },
              { id: 'shareProfile', label: 'Share Profile', description: 'Allow others to view your profile' },
              { id: 'allowRecommendations', label: 'Personalized Recommendations', description: 'Allow personalized content recommendations' }
            ].map((privacy) => (
              <div key={privacy.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div>
                  <h3 className="font-medium text-foreground">{privacy.label}</h3>
                  <p className="text-sm text-muted-foreground">{privacy.description}</p>
                </div>
                <Button
                  variant={settings[privacy.id] ? "success" : "outline"}
                  onClick={() => handleChange(privacy.id, !settings[privacy.id])}
                >
                  {settings[privacy.id] ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-muted/20 rounded-lg p-6 border border-border">
            {renderTabContent()}
            
            <div className="mt-8 flex justify-end">
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;