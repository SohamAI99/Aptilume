import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const ActivityFeed = ({ activities }) => {
  const [filter, setFilter] = useState('all');
  const [showDetails, setShowDetails] = useState({});

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'user_action', label: 'User Actions' },
    { value: 'admin_action', label: 'Admin Actions' },
    { value: 'system', label: 'System Events' },
    { value: 'security', label: 'Security' }
  ];

  const filteredActivities = activities?.filter(activity => 
    filter === 'all' || activity?.type === filter
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_action': return 'User';
      case 'admin_action': return 'Shield';
      case 'system': return 'Server';
      case 'security': return 'Lock';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type, status) => {
    if (status === 'error') return 'text-red-600 bg-red-100';
    
    switch (type) {
      case 'user_action': return 'text-blue-600 bg-blue-100';
      case 'admin_action': return 'text-purple-600 bg-purple-100';
      case 'system': return 'text-green-600 bg-green-100';
      case 'security': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const toggleDetails = (activityId) => {
    setShowDetails(prev => ({
      ...prev,
      [activityId]: !prev?.[activityId]
    }));
  };

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Activity" size={20} className="mr-2 text-primary" />
            Activity Feed
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time platform activity and user actions
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e?.target?.value)}
          className="text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
        >
          {filterOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Feed Data Source Info */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <h4 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center">
          <Icon name="Database" size={16} className="mr-1" />
          Activity Feed (Realtime)
        </h4>
        <div className="text-xs text-indigo-800 space-y-1">
          <p>Connected to Firestore collection: <code className="font-mono">activity_logs</code></p>
          <p>Sorted by <code className="font-mono">createdAt</code> descending, limited to recent items.</p>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities?.length > 0 ? (
          filteredActivities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              {/* Activity Icon */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                getActivityColor(activity?.type, activity?.status)
              )}>
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={14} 
                />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity?.action}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(activity?.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {activity?.user !== 'system' ? (
                    <>By {activity?.user}</>
                  ) : (
                    <>System automated action</>
                  )}
                  {activity?.details && (
                    <> • {activity?.details}</>
                  )}
                </p>

                {/* Activity Status */}
                {activity?.status && (
                  <div className="flex items-center mt-2">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      activity?.status === 'success' ? 'bg-green-100 text-green-800' :
                      activity?.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      activity?.status === 'error'? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    )}>
                      <Icon 
                        name={
                          activity?.status === 'success' ? 'CheckCircle' :
                          activity?.status === 'warning' ? 'AlertTriangle' :
                          activity?.status === 'error'? 'XCircle' : 'Clock'
                        } 
                        size={10} 
                        className="mr-1" 
                      />
                      {activity?.status?.charAt(0)?.toUpperCase() + activity?.status?.slice(1)}
                    </span>

                    {activity?.details && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => toggleDetails(activity?.id)}
                        className="ml-2 p-1 h-auto"
                      >
                        <Icon 
                          name={showDetails?.[activity?.id] ? 'ChevronUp' : 'ChevronDown'} 
                          size={12} 
                        />
                      </Button>
                    )}
                  </div>
                )}

                {/* Expanded Details */}
                {showDetails?.[activity?.id] && activity?.details && (
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                    <h5 className="text-xs font-semibold text-foreground mb-1">Details:</h5>
                    <p className="text-xs text-muted-foreground font-mono">
                      {activity?.details}
                    </p>
                    {activity?.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <strong>Timestamp:</strong> {new Date(activity?.timestamp)?.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h4 className="text-sm font-medium text-foreground mb-2">No activities found</h4>
            <p className="text-xs text-muted-foreground">
              {filter === 'all' ?'No recent activity to display'
                : `No ${filterOptions?.find(opt => opt?.value === filter)?.label?.toLowerCase()} found`
              }
            </p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      {filteredActivities?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm font-semibold text-blue-600">
                {activities?.filter(a => a?.type === 'user_action')?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">User Actions</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-purple-600">
                {activities?.filter(a => a?.type === 'admin_action')?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Admin Actions</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-green-600">
                {activities?.filter(a => a?.type === 'system')?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">System Events</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-red-600">
                {activities?.filter(a => a?.status === 'error')?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>
        </div>
      )}

      {/* Load More */}
      {filteredActivities?.length > 0 && (
        <div className="mt-4 text-center">
          <Button
            size="sm"
            variant="ghost"
            iconName="Plus"
            iconPosition="left"
            onClick={() => console.log('Load more activities')}
          >
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;