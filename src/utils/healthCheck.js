// Simple health check script
console.log('=== Application Health Check ===');

// Check Node.js version
console.log('Node.js version:', process.version);

// Check environment variables
console.log('Environment variables check:');
console.log('- VITE_FIREBASE_PROJECT_ID:', process.env.VITE_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING');

// Check current working directory
console.log('Current working directory:', process.cwd());

// Check if required files exist
import { existsSync } from 'fs';
import { join } from 'path';

const requiredFiles = [
  '.env',
  'src/index.jsx',
  'src/App.jsx',
  'src/Routes.jsx',
  'src/utils/firebase.js'
];

console.log('\nRequired files check:');
requiredFiles.forEach(file => {
  const fullPath = join(process.cwd(), file);
  const exists = existsSync(fullPath);
  console.log(`- ${file}: ${exists ? 'FOUND' : 'MISSING'}`);
});

console.log('\n=== Health check completed ===');