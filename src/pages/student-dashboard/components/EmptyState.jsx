import React from 'react';
import { FileX, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  icon = "FileX", 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  // Map icon names to actual Lucide icons
  const iconMap = {
    FileX: FileX
  };

  const IconComponent = iconMap[icon] || FileX;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconComponent className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          variant="default"
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;