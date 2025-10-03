const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let db = null;
let firebaseApp = null;

try {
  // Check if we're running on Vercel
  const isVercel = !!process.env.VERCEL;
  
  if (isVercel) {
    // On Vercel, use environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      if (admin.apps.length === 0) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        firebaseApp = admin.app();
      }
      
      db = admin.firestore();
      console.log('Firebase Admin SDK initialized successfully (Vercel)');
    } else {
      console.log('Firebase service account not found in environment variables');
      console.log('Firebase features will be disabled.');
      db = null;
    }
  } else {
    // Local development - use service account file
    const path = require('path');
    const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
    
    const fs = require('fs');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      
      if (admin.apps.length === 0) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        firebaseApp = admin.app();
      }
      
      db = admin.firestore();
      console.log('Firebase Admin SDK initialized successfully (Local)');
    } else {
      console.log('Firebase service account file not found at:', serviceAccountPath);
      console.log('Firebase features will be disabled.');
      console.log('To enable Firebase, create a service account JSON file at the above path.');
      db = null;
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
  console.log('Firebase features will be disabled.');
  db = null;
}

module.exports = { admin, db, firebaseApp };