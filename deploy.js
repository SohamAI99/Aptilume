#!/usr/bin/env node

// Deployment script for Firebase Hosting
const { execSync } = require('child_process');
const fs = require('fs');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'ignore' });
} catch (error) {
  console.error('Firebase CLI is not installed. Please install it first:');
  console.error('npm install -g firebase-tools');
  process.exit(1);
}

// Check if we're in the right directory
if (!fs.existsSync('firebase.json')) {
  console.error('firebase.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

// Build the project
console.log('Building the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed. Please check for errors.');
  process.exit(1);
}

// Deploy to Firebase Hosting
console.log('Deploying to Firebase Hosting...');
try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('Deployment successful!');
} catch (error) {
  console.error('Deployment failed.');
  process.exit(1);
}