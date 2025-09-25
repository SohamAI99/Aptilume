// Script to list all quizzes in the database
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

async function listQuizzes() {
  try {
    console.log('Listing all quizzes...');
    
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    
    if (quizzesSnapshot.empty) {
      console.log('No quizzes found in the database.');
      return;
    }
    
    console.log(`Found ${quizzesSnapshot.size} quizzes:`);
    
    quizzesSnapshot.forEach((doc) => {
      const quiz = doc.data();
      console.log(`- ID: ${doc.id}`);
      console.log(`  Title: ${quiz.title}`);
      console.log(`  Description: ${quiz.description}`);
      console.log(`  Question Count: ${quiz.questionCount}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error listing quizzes:', error);
  }
}

listQuizzes();