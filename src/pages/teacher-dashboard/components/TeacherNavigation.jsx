import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, Users, BarChart3, Sparkles, Zap } from 'lucide-react';

const TeacherNavigation = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/teacher-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/teacher/create-quiz', label: 'Create Quiz', icon: <PlusCircle size={18} /> },
    { path: '/teacher/quizzes', label: 'My Quizzes', icon: <FileText size={18} /> },
    { path: '/teacher/students', label: 'Students', icon: <Users size={18} /> },
    { path: '/teacher/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { path: '/teacher/ai-assistance', label: 'AI Assistance', icon: <Sparkles size={18} /> }
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
              <Zap size={18} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">AptiLume</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'T'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {currentUser?.name || 'Teacher'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser?.email || 'teacher@aptilume.com'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full mt-4 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherNavigation;