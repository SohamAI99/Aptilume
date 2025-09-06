import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const NavigationSidebar = ({ activeSection, onSectionChange }) => {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'BarChart3',
      description: 'Dashboard overview'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      description: 'Manage platform users'
    },
    {
      id: 'tests',
      label: 'Test Management',
      icon: 'BookOpen',
      description: 'Manage assessments'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'TrendingUp',
      description: 'Detailed analytics'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'FileText',
      description: 'Generate reports'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: 'Settings',
      description: 'Platform configuration'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 lg:block hidden overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navigationItems?.map((item) => (
            <button
              key={item?.id}
              onClick={() => onSectionChange(item?.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                activeSection === item?.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                className={cn(
                  "flex-shrink-0",
                  activeSection === item?.id ? "text-primary-foreground" : ""
                )}
              />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium truncate",
                  activeSection === item?.id ? "text-primary-foreground" : "text-foreground"
                )}>
                  {item?.label}
                </div>
                <div className={cn(
                  "text-xs truncate mt-0.5",
                  activeSection === item?.id ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {item?.description}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default NavigationSidebar;