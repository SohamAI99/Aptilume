import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudentNavigation = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/student-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/student/quizzes', label: 'My Quizzes', icon: 'FileText' },
    { path: '/attempt-history', label: 'Attempt History', icon: 'History' },
    { path: '/student/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/student/resources', label: 'Resources', icon: 'BookOpen' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleProfile = () => {
    navigate('/student/profile');
  };

  const handleSettings = () => {
    navigate('/student/settings');
  };

  const handleAttemptHistory = () => {
    navigate('/attempt-history');
  };

  return (
    <div className="border-r border-border bg-background w-64 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Icon name="Brain" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AptiLume</h1>
            <p className="text-xs text-muted-foreground">Student Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentUser?.name || 'Student'}</p>
            <p className="text-xs text-muted-foreground truncate">Student</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleProfile}
            className="flex-1"
            iconName="User"
          >
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSettings}
            className="flex-1"
            iconName="Settings"
          >
            Settings
          </Button>
        </div>
        
        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={onLogout}
          iconName="LogOut"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default StudentNavigation;
