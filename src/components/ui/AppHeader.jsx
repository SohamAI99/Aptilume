import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';


const AppHeader = ({ user, onLogout, className = '' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    // Determine the appropriate dashboard based on user role
    const userType = user?.userType;
    let dashboardPath = '/student-dashboard';
    
    if (userType === 'admin') {
      dashboardPath = '/admin-dashboard';
    } else if (userType === 'teacher') {
      dashboardPath = '/teacher-dashboard';
    }
    
    if (location?.pathname !== dashboardPath) {
      navigate(dashboardPath);
    }
  };

  const getContextualAction = () => {
    switch (location?.pathname) {
      case '/quiz-rules-instructions':
        return (
          <Button
            variant="outline"
            size="sm"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => {
              // Determine the appropriate dashboard based on user role
              const userType = user?.userType;
              let dashboardPath = '/student-dashboard';
              
              if (userType === 'admin') {
                dashboardPath = '/admin-dashboard';
              } else if (userType === 'teacher') {
                dashboardPath = '/teacher-dashboard';
              }
              
              navigate(dashboardPath);
            }}
            className="mr-4"
          >
            Back to Dashboard
          </Button>
        );
      case '/password-gate-verification':
        return (
          <Button
            variant="outline"
            size="sm"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => navigate('/quiz-rules-instructions')}
            className="mr-4"
          >
            Back to Instructions
          </Button>
        );
      case '/exam-interface':
        return (
          <Button
            variant="destructive"
            size="sm"
            iconName="AlertTriangle"
            iconPosition="left"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the exam? Your progress will be lost.')) {
                // Determine the appropriate dashboard based on user role
                const userType = user?.userType;
                let dashboardPath = '/student-dashboard';
                
                if (userType === 'admin') {
                  dashboardPath = '/admin-dashboard';
                } else if (userType === 'teacher') {
                  dashboardPath = '/teacher-dashboard';
                }
                
                navigate(dashboardPath);
              }
            }}
            className="mr-4"
          >
            Exit Exam
          </Button>
        );
      default:
        return null;
    }
  };

  const handleProfileAction = (action) => {
    setIsProfileOpen(false);
    switch (action) {
      case 'profile':
        // Navigate to the appropriate profile page based on user role
        const userType = user?.userType;
        if (userType === 'admin') {
          navigate('/admin/profile');
        } else if (userType === 'teacher') {
          navigate('/teacher/profile');
        } else {
          navigate('/student/profile');
        }
        break;
      case 'history':
        // Only students should have access to attempt history
        if (user?.userType === 'student') {
          navigate('/attempt-history');
        } else {
          // For teachers and admins, redirect to their dashboard
          const userType = user?.userType;
          let dashboardPath = '/student-dashboard';
          
          if (userType === 'admin') {
            dashboardPath = '/admin-dashboard';
          } else if (userType === 'teacher') {
            dashboardPath = '/teacher-dashboard';
          }
          
          navigate(dashboardPath);
        }
        break;
      case 'settings':
        // Navigate to the appropriate settings page based on user role
        const settingsUserType = user?.userType;
        if (settingsUserType === 'admin') {
          navigate('/admin/settings');
        } else if (settingsUserType === 'teacher') {
          navigate('/teacher/settings');
        } else {
          navigate('/student/settings');
        }
        break;
      case 'logout':
        if (window.confirm('Are you sure you want to logout?')) {
          onLogout?.();
        }
        break;
      default:
        break;
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 ${className}`}>
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity focus-ring rounded-lg p-2 -ml-2"
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-elevation-2">
              <img src="/logo.png" alt="AptiLume" className="h-5 w-5 object-contain" />
            </div>
            <span className="text-xl font-semibold text-foreground">AptiLume</span>
          </button>
          
          {/* Contextual Actions */}
          <div className="ml-6">
            {getContextualAction()}
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/60 transition-colors focus-ring"
          >
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-elevation-1">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground">
                {user?.name || 'Student'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email || 'student@example.com'}
              </p>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-popover/95 backdrop-blur-lg border border-border rounded-xl shadow-elevation-3 animate-fade-in">
              <div className="p-4 border-b border-border/70">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-elevation-1">
                    <Icon name="User" size={20} color="white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user?.name || 'Student User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email || 'student@example.com'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => handleProfileAction('profile')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="User" size={16} />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={() => handleProfileAction('history')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="History" size={16} />
                  <span>Attempt History</span>
                </button>
                
                <button
                  onClick={() => handleProfileAction('settings')}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="Settings" size={16} />
                  <span>Settings</span>
                </button>
                
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={() => handleProfileAction('logout')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;