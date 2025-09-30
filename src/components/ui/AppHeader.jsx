import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Menu, X, User, LogOut, Settings, Bell } from 'lucide-react';
import { logoutUser } from '../../utils/authService';

const AppHeader = ({ 
  currentUser, 
  isSidebarOpen, 
  setIsSidebarOpen,
  onNavigate,
  showSidebarToggle = true,
  showUserMenu = true
}) => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and sidebar toggle */}
          <div className="flex items-center">
            {showSidebarToggle && (
              <button
                type="button"
                className="lg:hidden mr-3 p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <img src="/logo.png" alt="AptiLume" className="h-4 w-4 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">AptiLume</h1>
            </div>
          </div>

          {/* Right side - User menu */}
          {showUserMenu && currentUser && (
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials(currentUser.name)}
                    </span>
                  </div>
                  <span className="text-foreground hidden md:block">
                    {currentUser.name}
                  </span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => onNavigate('/profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => onNavigate('/settings')}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
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