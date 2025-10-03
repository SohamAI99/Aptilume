#!/usr/bin/env node

// Deployment script for Firebase Hosting or Vercel
const { execSync } = require('child_process');
const fs = require('fs');

// Get deployment target from command line argument
const target = process.argv[2] || 'firebase';

if (target === 'firebase') {
  deployToFirebase();
} else if (target === 'vercel') {
  deployToVercel();
} else {
  console.error('Invalid deployment target. Use "firebase" or "vercel".');
  process.exit(1);
}

function deployToFirebase() {
  console.log('Deploying to Firebase...');
  
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
    console.log('Firebase deployment successful!');
  } catch (error) {
    console.error('Firebase deployment failed.');
    process.exit(1);
  }
}

function deployToVercel() {
  console.log('Deploying to Vercel...');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Vercel CLI is not installed. Please install it first:');
    console.error('npm install -g vercel');
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

  // Deploy to Vercel
  console.log('Deploying to Vercel...');
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('Vercel deployment successful!');
  } catch (error) {
    console.error('Vercel deployment failed.');
    process.exit(1);
  }
}