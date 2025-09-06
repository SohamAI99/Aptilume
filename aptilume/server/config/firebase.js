const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let db;
try {
  // Use absolute path to service account file
  const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
  
  // Check if service account file exists
  const fs = require('fs');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    // Check if Firebase app already exists
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Use existing app
      admin.app();
    }
    db = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.log('Firebase service account file not found at:', serviceAccountPath);
    console.log('Firebase features will be disabled.');
    console.log('To enable Firebase, create a service account JSON file at the above path.');
    db = null;
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
  console.log('Firebase features will be disabled.');
  db = null;
}

module.exports = { admin, db };