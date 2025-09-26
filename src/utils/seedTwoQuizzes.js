// Seed helper to create only two quizzes: Microsoft Technical Interview Prep and Meta Product Sense Assessment
import { db, auth } from './firebase';
import { createOrUpdateMicrosoftQuiz } from './createMicrosoftQuiz';
import { createOrUpdateMetaQuiz } from './createMetaQuiz';
import { createOrUpdateAptitudeQuiz } from './createAptitudeQuiz';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  limit
} from 'firebase/firestore';

export async function seedTwoQuizzes(user) {
  console.log('Seeding quizzes as requested...');
  
  try {
    // Create or update Microsoft Technical Interview Prep quiz
    const microsoftQuizId = await createOrUpdateMicrosoftQuiz();
    console.log(`Microsoft quiz ID: ${microsoftQuizId}`);
    
    // Create or update Meta Product Sense Assessment quiz
    const metaQuizId = await createOrUpdateMetaQuiz();
    console.log(`Meta quiz ID: ${metaQuizId}`);
    
    // Create or update Aptitude Test quiz
    const aptitudeQuizId = await createOrUpdateAptitudeQuiz();
    console.log(`Aptitude quiz ID: ${aptitudeQuizId}`);
    
    // Seed user stats if user exists
    if (user?.uid) {
      await setDoc(doc(db, 'user_stats', user.uid), {
        totalTests: 0,
        completedTests: 0,
        averageScore: 0,
        totalTime: '0h 0m',
        streak: 0,
        rank: 0,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
    
    console.log('Successfully seeded quizzes!');
    return [microsoftQuizId, metaQuizId, aptitudeQuizId];
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    throw error;
  }
}