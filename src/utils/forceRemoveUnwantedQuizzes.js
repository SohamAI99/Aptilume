// Force remove unwanted quizzes - more aggressive approach
import { db } from './firebase.js';
import { collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';

// List of quizzes to remove (with possible variations)
const quizzesToRemove = [
  "Startup Technical Challenge",
  "Amazon Leadership Principles Quiz",
  "Google Software Engineer Assessment"
];

// Partial matches to also remove
const partialMatches = [
  "Startup",
  "Amazon",
  "Google",
  "Technical Challenge",
  "Leadership Principles",
  "Software Engineer"
];

export async function forceRemoveUnwantedQuizzes() {
  try {
    console.log('Force removing unwanted quizzes...');
    
    // First, get all quizzes
    console.log('Getting all quizzes...');
    const allQuizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    
    if (allQuizzesSnapshot.empty) {
      console.log('No quizzes found in the database.');
      return { success: true, removedQuizzes: [] };
    }
    
    console.log(`Found ${allQuizzesSnapshot.size} total quizzes`);
    
    const quizzesToRemoveList = [];
    
    // Check each quiz against our removal criteria
    allQuizzesSnapshot.forEach((doc) => {
      const quiz = doc.data();
      const title = quiz.title || '';
      
      // Check for exact matches
      const hasExactMatch = quizzesToRemove.some(quizTitle => 
        title.toLowerCase() === quizTitle.toLowerCase()
      );
      
      // Check for partial matches
      const hasPartialMatch = partialMatches.some(partial => 
        title.toLowerCase().includes(partial.toLowerCase())
      );
      
      if (hasExactMatch || hasPartialMatch) {
        quizzesToRemoveList.push({
          id: doc.id,
          title: title,
          reason: hasExactMatch ? 'exact match' : 'partial match'
        });
        console.log(`Marking for removal: "${title}" (${doc.id}) - ${hasExactMatch ? 'exact match' : 'partial match'}`);
      }
    });
    
    if (quizzesToRemoveList.length === 0) {
      console.log('No quizzes marked for removal.');
      return { success: true, removedQuizzes: [] };
    }
    
    console.log(`Removing ${quizzesToRemoveList.length} quizzes...`);
    
    // Remove each marked quiz
    for (const quizToRemove of quizzesToRemoveList) {
      const { id, title, reason } = quizToRemove;
      console.log(`Removing quiz: "${title}" (ID: ${id}) - Reason: ${reason}`);
      
      // First, delete all questions in the quiz's subcollection
      try {
        const questionsQuery = query(collection(db, 'quizzes', id, 'questions'));
        const questionsSnapshot = await getDocs(questionsQuery);
        
        console.log(`  Deleting ${questionsSnapshot.size} questions for quiz ${id}`);
        
        for (const questionDoc of questionsSnapshot.docs) {
          await deleteDoc(questionDoc.ref);
        }
        
        console.log(`  Deleted all questions for quiz ${id}`);
      } catch (questionsError) {
        console.error(`  Error deleting questions for quiz ${id}:`, questionsError);
      }
      
      // Then delete the quiz document itself
      await deleteDoc(doc(db, 'quizzes', id));
      console.log(`  Deleted quiz: "${title}" (ID: ${id})`);
    }
    
    console.log('Finished force removing unwanted quizzes!');
    return { 
      success: true, 
      removedQuizzes: quizzesToRemoveList.map(q => q.title),
      count: quizzesToRemoveList.length
    };
  } catch (error) {
    console.error('Error force removing unwanted quizzes:', error);
    throw error;
  }
}

export default { forceRemoveUnwantedQuizzes };