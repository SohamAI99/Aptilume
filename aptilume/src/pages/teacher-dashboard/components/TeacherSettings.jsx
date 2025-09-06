import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TeacherSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'quiz', label: 'Quiz Settings', icon: 'FileText' }
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
    quizUpdates: true,
    studentSubmissions: true,
    
    // Quiz settings
    defaultQuizDuration: 60,
    defaultQuestionCount: 20,
    autoPublishResults: true
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
            <div>
              <h3 className="text-lg font-semibold mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={(e) => handleChange('twoFactor', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Password Expiry</h4>
                  <p className="text-sm text-muted-foreground">Require password change every X days</p>
                </div>
                <select
                  value={settings.passwordExpiry}
                  onChange={(e) => handleChange('passwordExpiry', parseInt(e.target.value))}
                  className="px-3 py-1 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                >
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive email updates about platform activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Quiz Updates</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications when your quizzes are updated</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.quizUpdates}
                    onChange={(e) => handleChange('quizUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Student Submissions</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications when students submit quizzes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.studentSubmissions}
                    onChange={(e) => handleChange('studentSubmissions', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quiz Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Default Quiz Duration</h4>
                  <p className="text-sm text-muted-foreground">Set the default time limit for new quizzes</p>
                </div>
                <select
                  value={settings.defaultQuizDuration}
                  onChange={(e) => handleChange('defaultQuizDuration', parseInt(e.target.value))}
                  className="px-3 py-1 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Default Question Count</h4>
                  <p className="text-sm text-muted-foreground">Set the default number of questions for new quizzes</p>
                </div>
                <select
                  value={settings.defaultQuestionCount}
                  onChange={(e) => handleChange('defaultQuestionCount', parseInt(e.target.value))}
                  className="px-3 py-1 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                >
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                  <option value={25}>25 questions</option>
                  <option value={30}>30 questions</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-publish Results</h4>
                  <p className="text-sm text-muted-foreground">Automatically publish results after quiz completion</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoPublishResults}
                    onChange={(e) => handleChange('autoPublishResults', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Teacher Settings</h2>
        <Button onClick={() => navigate('/teacher-dashboard')} variant="outline" iconName="ArrowLeft">
          Back to Dashboard
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="border-b border-border">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {renderTabContent()}
          
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} iconName="Save">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;