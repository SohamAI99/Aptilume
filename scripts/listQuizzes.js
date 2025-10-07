// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Simple script to list quizzes using the app's Firebase config
import { db } from '../src/utils/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

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