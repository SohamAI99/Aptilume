import React from 'react';
import { Button } from './Button';
import { X, Trash2, Edit, Copy, Move, Download, Share2 } from 'lucide-react';

const ContextualActionBar = ({ 
  selectedItems = [], 
  onClose, 
  actions = [],
  onAction 
}) => {
  const defaultActions = [
    { id: 'edit', label: 'Edit', icon: Edit },
    { id: 'duplicate', label: 'Duplicate', icon: Copy },
    { id: 'move', label: 'Move', icon: Move },
    { id: 'download', label: 'Download', icon: Download },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive' }
  ];

  const availableActions = actions.length > 0 ? actions : defaultActions;

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId, selectedItems);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-3 z-50">
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          {selectedItems.length} selected
        </div>
        
        <div className="h-4 w-px bg-border"></div>
        
        <div className="flex space-x-1">
          {availableActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'ghost'}
                size="sm"
                icon={IconComponent ? <IconComponent className="h-4 w-4" /> : null}
                onClick={() => handleAction(action.id)}
                className="px-2"
              >
                <span className="sr-only">{action.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="h-4 w-px bg-border"></div>
        
        <Button
          variant="ghost"
          size="sm"
          icon={<X className="h-4 w-4" />}
          onClick={onClose}
          className="px-2"
        >
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
};

export default ContextualActionBar;