import React, { useEffect, useState } from 'react';

const EnvTest = () => {
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    // Check if environment variables are available
    const vars = {
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
      VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
      VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      NODE_ENV: import.meta.env.NODE_ENV,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV
    };
    
    setEnvVars(vars);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Environment Variables Test</h1>
      <div style={{ marginTop: '20px' }}>
        <h2>Environment Variables:</h2>
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '10px' }}>
            <strong>{key}:</strong>{' '}
            {value ? (
              <span style={{ color: 'green' }}>
                {key.includes('KEY') || key.includes('SECRET') ? '[HIDDEN]' : value}
              </span>
            ) : (
              <span style={{ color: 'red' }}>NOT SET</span>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Analysis:</h2>
        {envVars.VITE_FIREBASE_API_KEY ? (
          <p style={{ color: 'green' }}>✅ Firebase API Key is set</p>
        ) : (
          <p style={{ color: 'red' }}>❌ Firebase API Key is missing</p>
        )}
        
        {envVars.VITE_FIREBASE_PROJECT_ID ? (
          <p style={{ color: 'green' }}>✅ Firebase Project ID is set</p>
        ) : (
          <p style={{ color: 'red' }}>❌ Firebase Project ID is missing</p>
        )}
        
        {envVars.NODE_ENV ? (
          <p style={{ color: 'green' }}>✅ NODE_ENV is set: {envVars.NODE_ENV}</p>
        ) : (
          <p style={{ color: 'red' }}>❌ NODE_ENV is missing</p>
        )}
      </div>
    </div>
  );
};

export default EnvTest;