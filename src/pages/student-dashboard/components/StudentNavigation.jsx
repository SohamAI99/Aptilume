import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import * as authService from '../../../utils/authService';

const StudentNavigation = ({ currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/student-dashboard',
      icon: 'Home',
    },
    {
      name: 'Quizzes',
      href: '/student/quizzes',
      icon: 'FileText',
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: 'Trophy',
    },
    {
      name: 'Analytics',
      href: '/student/analytics',
      icon: 'BarChart3',
    },
    {
      name: 'Resources',
      href: '/student/resources',
      icon: 'Book',
    },
    {
      name: 'Attempt History',
      href: '/student/attempt-history', // Updated this path
      icon: 'History',
    },
  ];

  const handleNavigation = async (href) => {
    console.log('StudentNavigation: Navigating to', href);
    try {
      // Navigate to the requested page immediately
      // The NavigationGuard will handle authentication and role checks
      navigate(href);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to dashboard
      navigate('/student-dashboard');
    }
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-1 min-h-0 border-r border-border bg-background">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={18} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">AptiLume</span>
            </div>
          </div>
          <nav className="flex-1 px-2 mt-5 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={18} className="mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col p-4 space-y-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={onLogout}
            iconName="LogOut"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentNavigation;