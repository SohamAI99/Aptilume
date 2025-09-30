import React from 'react';
import { BarChart3, Users, BookOpen, TrendingUp, FileText, Settings } from 'lucide-react';
import { cn } from '../../../utils/cn';

const NavigationSidebar = ({ activeSection, onSectionChange }) => {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard overview'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage platform users'
    },
    {
      id: 'tests',
      label: 'Test Management',
      icon: BookOpen,
      description: 'Manage assessments'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Detailed analytics'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Generate reports'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      description: 'Platform configuration'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-4 h-fit">
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                activeSection === item.id
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <IconComponent className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.label}</div>
                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default NavigationSidebar;