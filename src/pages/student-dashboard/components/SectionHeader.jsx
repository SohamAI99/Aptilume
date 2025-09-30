import React from 'react';
import Button from '../../../components/ui/Button';
import { ArrowRight } from 'lucide-react';

const SectionHeader = ({ 
  title, 
  subtitle, 
  icon, 
  actionLabel, 
  onAction, 
  count,
  className = '' 
}) => {
  // Map icon names to lucide-react icons
  const getIcon = (iconName) => {
    // Since we're not using AppIcon anymore, we'll just return null
    // In a real implementation, you might want to map specific icon names to lucide-react icons
    return null;
  };

  const iconComponent = icon ? getIcon(icon) : null;

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-3">
        {iconComponent && (
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            {iconComponent}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {count !== undefined && (
              <span className="bg-muted text-muted-foreground text-sm px-2 py-1 rounded-full">
                {count}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;