import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AdminNavigation = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/users', label: 'User Management', icon: 'Users' },
    { path: '/admin/quizzes', label: 'Quiz Management', icon: 'FileText' },
    { path: '/admin/reports', label: 'Reports', icon: 'BarChart3' },
    { path: '/admin/ai-assistance', label: 'AI Assistance', icon: 'Sparkles' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="border-r border-border bg-background w-64 flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Icon name="Brain" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AptiLume</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
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
    </div>
  );
};

export default AdminNavigation;