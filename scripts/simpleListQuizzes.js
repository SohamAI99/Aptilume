// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listQuizzes() {
  try {
    console.log('Listing all quizzes...');
    
    // Get all quizzes
    const allQuizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    
    if (allQuizzesSnapshot.empty) {
      console.log('No quizzes found in the database.');
      return [];
    }
    
    console.log(`Found ${allQuizzesSnapshot.size} quizzes:`);
    
    const quizzes = [];
    
    // Display each quiz
    allQuizzesSnapshot.forEach((doc) => {
      const quiz = doc.data();
      const title = quiz.title || 'Untitled Quiz';
      const company = Array.isArray(quiz.companies) ? quiz.companies[0] : quiz.companies || 'Unknown';
      
      quizzes.push({
        id: doc.id,
        title: title,
        company: company,
        questionCount: quiz.questionCount || 0,
        duration: quiz.duration || 0
      });
      
      console.log(`- ${title} (${company}) - ${quiz.questionCount || 0} questions, ${quiz.duration || 0} min`);
    });
    
    return quizzes;
  } catch (error) {
    console.error('Error listing quizzes:', error);
    throw error;
  }
}

// Run the function
listQuizzes()
  .then(quizzes => {
    console.log('Quizzes listed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to list quizzes:', error);
    process.exit(1);
  });