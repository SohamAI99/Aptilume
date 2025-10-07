import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ProfileDropdown = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false) ;
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    // Navigate to profile based on user type
    const profilePath = currentUser?.userType === 'admin' 
      ? '/admin/profile' 
      : currentUser?.userType === 'teacher' 
        ? '/teacher/profile' 
        : '/student/profile';
    
    navigate(profilePath);
    setShowDropdown(false);
  };

  const handleSettings = () => {
    // Navigate to settings based on user type
    const settingsPath = currentUser?.userType === 'admin' 
      ? '/admin/settings' 
      : currentUser?.userType === 'teacher' 
        ? '/teacher/settings' 
        : '/student/settings';
    
    navigate(settingsPath);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <img
          src={currentUser?.avatar || currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium hidden md:inline-block">
          {currentUser?.name || 'User'}
        </span>
        <Icon 
          name={showDropdown ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground" 
        />
      </button>

      {/* Profile Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.avatar || currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-foreground text-sm">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-1">
            <button
              onClick={handleProfile}
              className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded transition-colors flex items-center gap-2"
            >
              <Icon name="User" size={14} />
              Profile
            </button>
            <button
              onClick={handleSettings}
              className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded transition-colors flex items-center gap-2"
            >
              <Icon name="Settings" size={14} />
              Settings
            </button>
            <hr className="my-1 border-border" />
            <button
              onClick={onLogout}
              className="w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded transition-colors flex items-center gap-2"
            >
              <Icon name="LogOut" size={14} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;