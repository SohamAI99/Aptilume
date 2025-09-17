import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/ui/AppHeader';
import AdminNavigation from '../components/AdminNavigation';
import UserManagementTable from '../components/UserManagementTable';
import * as authService from '../../../utils/authService';
import { listenToUsers } from '../../../utils/dbService';
import Icon from '../../../components/AppIcon';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Listen to real-time user data
    const unsubscribe = listenToUsers((usersData) => {
      setUsers(usersData);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      navigate('/authentication-login-register');
    }
  };

  const handleProfile = () => {
    // Navigate to profile page
    navigate('/profile');
  };

  const handleSettings = () => {
    // Navigate to settings page
    navigate('/settings');
  };

  const handleDashboard = () => {
    // Navigate to dashboard
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading user management...</p>
          </div>
        </div>
      </div>
    );
  }

  const mockUser = {
    id: currentUser?.uid || "1",
    name: currentUser?.name || currentUser?.displayName || "Admin",
    email: currentUser?.email || "",
    avatar: currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    userType: currentUser?.userType || "admin"
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNavigation currentUser={mockUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header with Profile */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage platform users, roles, and permissions
                  </p>
                </div>
                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <img
                      src={mockUser?.avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-foreground hidden md:inline">
                      {mockUser?.name}
                    </span>
                    <Icon 
                      name={showProfileDropdown ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <img
                            src={mockUser?.avatar}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground">{mockUser?.name}</p>
                            <p className="text-sm text-muted-foreground">{mockUser?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleProfile();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Icon name="User" size={16} />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            handleSettings();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Icon name="Settings" size={16} />
                          Settings
                        </button>
                        <hr className="my-1 border-border" />
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Icon name="LogOut" size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <UserManagementTable users={users} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersPage;