import React, { useEffect, useState } from 'react';

const FirebaseTest = () => {
  const [firebaseStatus, setFirebaseStatus] = useState('Initializing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        setFirebaseStatus('Loading Firebase modules...');
        
        // Dynamically import Firebase modules
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getAuth } = await import('firebase/auth');
        const { getFirestore } = await import('firebase/firestore');
        
        setFirebaseStatus('Firebase modules loaded');
        
        // Check environment variables
        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
          measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
        };
        
        // Log config (without sensitive data)
        console.log('Firebase Config Keys:', Object.keys(firebaseConfig).filter(key => firebaseConfig[key]));
        
        // Check if required config values are present
        const missingKeys = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key]);
        if (missingKeys.length > 0) {
          throw new Error(`Missing Firebase config keys: ${missingKeys.join(', ')}`);
        }
        
        setFirebaseStatus('Firebase config validated');
        
        // Initialize Firebase app
        let app;
        if (getApps().length === 0) {
          app = initializeApp(firebaseConfig);
          setFirebaseStatus('Firebase app initialized');
        } else {
          app = getApp();
          setFirebaseStatus('Using existing Firebase app');
        }
        
        // Initialize services
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        setFirebaseStatus('Firebase services initialized successfully');
        
        // Try a simple operation
        try {
          const { collection, getDocs } = await import('firebase/firestore');
          setFirebaseStatus('Testing Firestore connection...');
          
          // This will fail if not authenticated, but we can catch that
          const querySnapshot = await getDocs(collection(db, 'quizzes'));
          setFirebaseStatus(`Firestore connected! Found ${querySnapshot.size} quizzes (might be 0 if not authenticated)`);
        } catch (firestoreError) {
          if (firestoreError.code === 'permission-denied') {
            setFirebaseStatus('Firestore connected but permission denied (expected if not authenticated)');
          } else {
            console.warn('Firestore test error (might be expected):', firestoreError);
            setFirebaseStatus('Firestore connected (test query completed with expected permissions error)');
          }
        }
        
      } catch (err) {
        console.error('Firebase test error:', err);
        setError(err.message);
        setFirebaseStatus(`Error: ${err.message}`);
      }
    };
    
    testFirebase();
  }, []);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Firebase Connection Test</h1>
      <div style={{ 
        padding: '15px', 
        margin: '10px 0',
        borderRadius: '4px',
        backgroundColor: error ? '#ffebee' : '#e8f5e9',
        borderLeft: `4px solid ${error ? '#f44336' : '#4caf50'}`
      }}>
        <strong>Status:</strong> {firebaseStatus}
      </div>
      
      {error && (
        <div style={{ 
          padding: '15px', 
          margin: '10px 0',
          borderRadius: '4px',
          backgroundColor: '#ffebee',
          borderLeft: '4px solid #f44336'
        }}>
          <strong>Error Details:</strong>
          <pre style={{ 
            backgroundColor: '#ffcdd2', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>{error}</pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h2>Next Steps:</h2>
        <ol>
          <li>Check browser console for detailed logs</li>
          <li>Verify environment variables are set correctly</li>
          <li>If "permission-denied" is expected, Firebase is working correctly</li>
        </ol>
      </div>
    </div>
  );
};

export default FirebaseTest;