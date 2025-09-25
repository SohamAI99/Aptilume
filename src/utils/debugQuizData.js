// Utility to debug quiz data in Firebase
import { db } from './firebase.js';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

export const debugQuizData = async (quizId) => {
  try {
    console.log('Debugging quiz data for ID:', quizId);
    
    // Get quiz document
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (!quizDoc.exists()) {
      console.error('Quiz not found with ID:', quizId);
      return null;
    }
    
    const quizData = quizDoc.data();
    console.log('Quiz data:', quizData);
    
    // Get questions subcollection
    console.log('Fetching questions for quiz:', quizId);
    
    // Try with ordering first
    let questionsQuery;
    try {
      questionsQuery = query(
        collection(db, 'quizzes', quizId, 'questions'),
        orderBy('createdAt', 'asc')
      );
    } catch (orderError) {
      console.log('Ordering failed, trying without ordering');
      questionsQuery = collection(db, 'quizzes', quizId, 'questions');
    }
    
    const questionsSnapshot = await getDocs(questionsQuery);
    console.log('Questions snapshot size:', questionsSnapshot.size);
    
    const questions = [];
    questionsSnapshot.forEach((doc) => {
      const questionData = doc.data();
      console.log('Question document ID:', doc.id);
      console.log('Question data:', questionData);
      questions.push({
        id: doc.id,
        ...questionData
      });
    });
    
    console.log('All questions:', questions);
    
    return {
      quiz: {
        id: quizDoc.id,
        ...quizData
      },
      questions: questions
    };
  } catch (error) {
    console.error('Error debugging quiz data:', error);
    throw error;
  }
};

export default { debugQuizData };