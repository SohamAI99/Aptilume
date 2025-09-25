// Check if quizzes have the correct isPublished field
import { db } from './firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function checkPublishedQuizzes() {
  try {
    console.log('Checking published quizzes...');
    
    // Get all quizzes
    const allQuizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    
    if (allQuizzesSnapshot.empty) {
      console.log('No quizzes found in database');
      return;
    }
    
    console.log(`Found ${allQuizzesSnapshot.size} total quizzes:`);
    
    // Check published quizzes
    const publishedQuery = query(collection(db, 'quizzes'), where('isPublished', '==', true));
    const publishedSnapshot = await getDocs(publishedQuery);
    
    console.log(`\nFound ${publishedSnapshot.size} published quizzes:`);
    
    publishedSnapshot.forEach((doc, index) => {
      const quiz = doc.data();
      console.log(`${index + 1}. "${quiz.title}" (ID: ${doc.id})`);
      console.log(`   Published: ${quiz.isPublished}`);
      console.log(`   Recommended: ${quiz.isRecommended}`);
      console.log('---');
    });
    
    // Check unpublished quizzes
    const unpublishedQuery = query(collection(db, 'quizzes'), where('isPublished', '==', false));
    const unpublishedSnapshot = await getDocs(unpublishedQuery);
    
    console.log(`\nFound ${unpublishedSnapshot.size} unpublished quizzes:`);
    
    unpublishedSnapshot.forEach((doc, index) => {
      const quiz = doc.data();
      console.log(`${index + 1}. "${quiz.title}" (ID: ${doc.id})`);
      console.log(`   Published: ${quiz.isPublished}`);
      console.log(`   Recommended: ${quiz.isRecommended}`);
      console.log('---');
    });
    
    // Check quizzes without isPublished field
    const allQuizzes = [];
    allQuizzesSnapshot.forEach(doc => {
      allQuizzes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    const noPublishedField = allQuizzes.filter(quiz => quiz.isPublished === undefined);
    
    console.log(`\nFound ${noPublishedField.length} quizzes without isPublished field:`);
    
    noPublishedField.forEach((quiz, index) => {
      console.log(`${index + 1}. "${quiz.title}" (ID: ${quiz.id})`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error checking published quizzes:', error);
  }
}

checkPublishedQuizzes();