import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ProfileDropdown = ({ 
  user, 
  isOpen, 
  onClose, 
  onLogout, 
  className = '',
  position = 'right' 
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        onClose?.();
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleAction = (action) => {
    onClose?.();
    
    switch (action) {
      case 'profile': navigate('/student-dashboard');
        break;
      case 'history':
        // Navigate to attempt history when implemented
        console.log('Navigate to attempt history');
        break;
      case 'settings':
        // Navigate to settings when implemented
        console.log('Navigate to settings');
        break;
      case 'help':
        // Navigate to help when implemented
        console.log('Navigate to help');
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

  if (!isOpen) return null;

  const positionClasses = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-elevation-3 animate-fade-in z-50 ${positionClasses?.[position]} ${className}`}
    >
      {/* User Info Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={24} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {user?.name || 'Student User'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email || 'student@example.com'}
            </p>
            {user?.studentId && (
              <p className="text-xs text-muted-foreground font-mono">
                ID: {user?.studentId}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => handleAction('profile')}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors focus-ring"
        >
          <Icon name="User" size={18} />
          <div className="text-left">
            <p className="font-medium">Profile</p>
            <p className="text-xs text-muted-foreground">View and edit profile</p>
          </div>
        </button>
        
        <button
          onClick={() => handleAction('history')}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors focus-ring"
        >
          <Icon name="History" size={18} />
          <div className="text-left">
            <p className="font-medium">Attempt History</p>
            <p className="text-xs text-muted-foreground">View past exam results</p>
          </div>
        </button>
        
        <button
          onClick={() => handleAction('settings')}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors focus-ring"
        >
          <Icon name="Settings" size={18} />
          <div className="text-left">
            <p className="font-medium">Settings</p>
            <p className="text-xs text-muted-foreground">Preferences and account</p>
          </div>
        </button>
        
        <button
          onClick={() => handleAction('help')}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors focus-ring"
        >
          <Icon name="HelpCircle" size={18} />
          <div className="text-left">
            <p className="font-medium">Help & Support</p>
            <p className="text-xs text-muted-foreground">Get assistance</p>
          </div>
        </button>
        
        <div className="border-t border-border mt-2 pt-2">
          <button
            onClick={() => handleAction('logout')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors focus-ring"
          >
            <Icon name="LogOut" size={18} />
            <div className="text-left">
              <p className="font-medium">Logout</p>
              <p className="text-xs text-destructive/70">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;