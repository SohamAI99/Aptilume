import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Icon from './AppIcon';

const NetworkErrorBoundary = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Hide offline message after 5 seconds
    if (showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showOfflineMessage]);

  if (!isOnline) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="glass-card rounded-lg p-4 shadow-lg flex items-center gap-3">
          <Icon name="WifiOff" size={20} className="text-warning" />
          <div>
            <div className="font-medium">Offline Mode</div>
            <div className="text-sm text-muted-foreground">Some features may be limited</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showOfflineMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="glass-card rounded-lg p-4 shadow-lg flex items-center gap-3">
            <Icon name="Wifi" size={20} className="text-success" />
            <div>
              <div className="font-medium">Back Online</div>
              <div className="text-sm text-muted-foreground">All features restored</div>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default NetworkErrorBoundary;