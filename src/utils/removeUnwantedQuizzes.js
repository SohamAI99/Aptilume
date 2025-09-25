// Utility to remove unwanted quizzes from Firebase
import { db } from './firebase.js';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

// List of quizzes to remove
const quizzesToRemove = [
  "Startup Technical Challenge",
  "Amazon Leadership Principles Quiz",
  "Google Software Engineer Assessment"
];

export async function removeUnwantedQuizzes() {
  try {
    console.log('Removing unwanted quizzes...');
    
    for (const quizTitle of quizzesToRemove) {
      console.log(`Looking for quiz: ${quizTitle}`);
      
      // Query for quizzes with this title
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('title', '==', quizTitle)
      );
      
      const querySnapshot = await getDocs(quizzesQuery);
      
      if (querySnapshot.empty) {
        console.log(`No quiz found with title: ${quizTitle}`);
        continue;
      }
      
      console.log(`Found ${querySnapshot.size} quiz(es) with title: ${quizTitle}`);
      
      // Delete each matching quiz
      for (const docSnapshot of querySnapshot.docs) {
        const quizId = docSnapshot.id;
        console.log(`Deleting quiz: ${quizTitle} (ID: ${quizId})`);
        
        // First, delete all questions in the quiz's subcollection
        try {
          const questionsQuery = query(collection(db, 'quizzes', quizId, 'questions'));
          const questionsSnapshot = await getDocs(questionsQuery);
          
          console.log(`Deleting ${questionsSnapshot.size} questions for quiz ${quizId}`);
          
          for (const questionDoc of questionsSnapshot.docs) {
            await deleteDoc(questionDoc.ref);
          }
          
          console.log(`Deleted all questions for quiz ${quizId}`);
        } catch (questionsError) {
          console.error(`Error deleting questions for quiz ${quizId}:`, questionsError);
        }
        
        // Then delete the quiz document itself
        await deleteDoc(docSnapshot.ref);
        console.log(`Deleted quiz: ${quizTitle} (ID: ${quizId})`);
      }
    }
    
    console.log('Finished removing unwanted quizzes!');
    return { success: true, removedQuizzes: quizzesToRemove };
  } catch (error) {
    console.error('Error removing unwanted quizzes:', error);
    throw error;
  }
}

export default { removeUnwantedQuizzes };