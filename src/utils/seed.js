// Seed helper to create initial Firestore data for development/demo
import { db } from './firebase';
import { seedTwoQuizzes } from './seedTwoQuizzes';
import { removeUnwantedQuizzes } from './removeUnwantedQuizzes';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  limit
} from 'firebase/firestore';

export async function seedInitialData(user) {
  // user: Firebase user object
  // Creates: quizzes, user_stats/{uid}, attempts, activity_logs
  const now = serverTimestamp();

  // Remove unwanted quizzes first
  await removeUnwantedQuizzes();

  // Seed only two quizzes as requested
  await seedTwoQuizzes(user);

  // Seed user stats
  if (user?.uid) {
    await setDoc(doc(db, 'user_stats', user.uid), {
      totalTests: 12,
      completedTests: 8,
      averageScore: 78,
      totalTime: '6h 24m',
      streak: 5,
      rank: 156,
      updatedAt: now,
    }, { merge: true });
  }

  // Seed an attempt for the user
  if (user?.uid) {
    await addDoc(collection(db, 'attempts'), {
      userId: user.uid,
      testTitle: 'Sample Attempt',
      score: 87,
      correctAnswers: 26,
      totalQuestions: 30,
      timeTaken: '42 min',
      completedAt: now,
      status: 'completed',
      rank: 45,
      percentile: 92,
      createdAt: now,
    });
  }

  // Seed activity log
  await addDoc(collection(db, 'activity_logs'), {
    type: 'system',
    user: user?.email || 'system',
    action: 'seeded database',
    details: 'Initial demo data created with only two quizzes',
    status: 'success',
    createdAt: now,
  });
}