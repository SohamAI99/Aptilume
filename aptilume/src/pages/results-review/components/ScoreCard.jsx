import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreCard = ({ title, value, icon, color = 'primary' }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'secondary':
        return 'bg-secondary/10 text-secondary';
      case 'destructive':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="text-center p-6 bg-white/50 rounded-2xl border border-border/20 hover:shadow-elevation-2 transition-all duration-200">
      <div className={`w-12 h-12 rounded-xl ${getColorClasses(color)} flex items-center justify-center mx-auto mb-3`}>
        <Icon name={icon} size={24} />
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
};

export default ScoreCard;