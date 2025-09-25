import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const TeacherNavigation = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/teacher-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/teacher/create-quiz', label: 'Create Quiz', icon: 'PlusCircle' },
    { path: '/teacher/quizzes', label: 'My Quizzes', icon: 'FileText' },
    { path: '/teacher/students', label: 'Students', icon: 'Users' },
    { path: '/teacher/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/teacher/ai-assistance', label: 'AI Assistance', icon: 'Sparkles' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    // Updated the navigation structure to match the student navigation
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-1 min-h-0 border-r border-border bg-background">
        <div className="flex items-center flex-shrink-0 px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={18} color="white" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">AptiLume</span>
              <p className="text-xs text-muted-foreground">Teacher Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 mt-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={18} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-col p-4 space-y-3 border-t border-border">
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Icon name="LogOut" size={18} className="mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherNavigation;