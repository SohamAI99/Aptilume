// Check all quizzes and their exact data
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

async function checkAllQuizzes() {
  try {
    console.log('Checking all quizzes in database...');
    
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    
    if (quizzesSnapshot.empty) {
      console.log('No quizzes found in database');
      return;
    }
    
    console.log(`Found ${quizzesSnapshot.size} quizzes:`);
    
    let index = 1;
    for (const doc of quizzesSnapshot.docs) {
      const quizData = doc.data();
      console.log(`\n--- Quiz ${index} ---`);
      console.log(`ID: ${doc.id}`);
      console.log(`Title: "${quizData.title}"`);
      console.log(`Description: ${quizData.description}`);
      console.log(`Category: ${quizData.category}`);
      console.log(`Difficulty: ${quizData.difficulty}`);
      console.log(`Duration: ${quizData.duration}`);
      console.log(`Question Count: ${quizData.questionCount}`);
      console.log(`Is Published: ${quizData.isPublished}`);
      console.log(`Is Recommended: ${quizData.isRecommended}`);
      console.log(`Tags: ${JSON.stringify(quizData.tags || [])}`);
      
      // Check questions count
      try {
        const questionsQuery = collection(db, 'quizzes', doc.id, 'questions');
        const questionsSnapshot = await getDocs(questionsQuery);
        console.log(`Actual Questions Count: ${questionsSnapshot.size}`);
      } catch (questionsError) {
        console.log(`Error getting questions count: ${questionsError.message}`);
      }
      
      index++;
    }
  } catch (error) {
    console.error('Error checking quizzes:', error);
  }
}

checkAllQuizzes();