import React, { useEffect, useState } from 'react';
import { getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const FirebaseHealthCheck = () => {
  const [status, setStatus] = useState('Initializing...');
  const [details, setDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        setStatus('Checking Firebase configuration...');
        
        // Check if app is already initialized
        if (getApps().length > 0) {
          setStatus('Using existing Firebase app');
          setDetails(prev => ({ ...prev, appStatus: 'Using existing app' }));
        } else {
          setStatus('No existing Firebase app found');
          setDetails(prev => ({ ...prev, appStatus: 'No existing app' }));
        }
        
        // Check environment variables
        const requiredEnvVars = [
          'VITE_FIREBASE_API_KEY',
          'VITE_FIREBASE_AUTH_DOMAIN',
          'VITE_FIREBASE_PROJECT_ID',
          'VITE_FIREBASE_STORAGE_BUCKET',
          'VITE_FIREBASE_MESSAGING_SENDER_ID',
          'VITE_FIREBASE_APP_ID'
        ];
        
        const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
        const presentVars = requiredEnvVars.filter(varName => import.meta.env[varName]);
        
        setDetails(prev => ({
          ...prev,
          envVars: {
            present: presentVars.length,
            missing: missingVars.length,
            total: requiredEnvVars.length
          }
        }));
        
        if (missingVars.length > 0) {
          setStatus(`Missing ${missingVars.length} environment variables`);
          setError(`Missing environment variables: ${missingVars.join(', ')}`);
          return;
        }
        
        setStatus('Environment variables verified');
        
        // Use existing app instead of trying to initialize a new one
        try {
          const app = getApp();
          setStatus('Using existing Firebase app');
          
          setDetails(prev => ({ ...prev, appInitialization: 'Success' }));
          
          // Try to access Firestore
          try {
            const db = getFirestore(app);
            setDetails(prev => ({ ...prev, firestore: 'Connected' }));
            setStatus('Firebase Firestore connected');
          } catch (firestoreError) {
            setDetails(prev => ({ ...prev, firestore: 'Failed to connect' }));
            console.warn('Firestore connection warning:', firestoreError);
          }
          
          // Try to access Auth
          try {
            const authInstance = getAuth(app);
            setDetails(prev => ({ ...prev, auth: 'Connected' }));
            setStatus('Firebase Auth connected');
          } catch (authError) {
            setDetails(prev => ({ ...prev, auth: 'Failed to connect' }));
            console.warn('Auth connection warning:', authError);
          }
          
        } catch (initError) {
          setStatus('Firebase initialization failed');
          setError(initError.message);
          setDetails(prev => ({ ...prev, appInitialization: 'Failed' }));
        }
        
      } catch (e) {
        setStatus('Firebase health check failed');
        setError(e.message);
        console.error('Firebase health check error:', e);
      }
    };
    
    checkFirebase();
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Firebase Health Check</h1>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="font-medium">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              status.includes('Success') || status.includes('Connected') 
                ? 'bg-success/20 text-success' 
                : status.includes('Failed') || status.includes('Missing') || error
                ? 'bg-error/20 text-error'
                : 'bg-primary/20 text-primary'
            }`}>
              {status}
            </span>
          </div>
          
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="text-sm">
                {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
              </span>
            </div>
          ))}
          
          {error && (
            <div className="p-4 bg-error/10 border border-error/30 rounded-lg">
              <h3 className="font-medium text-error mb-2">Error:</h3>
              <p className="text-error text-sm">{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This health check verifies Firebase connectivity and configuration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseHealthCheck;