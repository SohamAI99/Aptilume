import { getApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, query, where, doc } from 'firebase/firestore';

// Use the existing Firebase app instead of initializing a new one
let app;
let db;

// Function to initialize Firebase connection
function initializeFirebase() {
  if (getApps().length === 0) {
    throw new Error('Firebase app not initialized. Please initialize Firebase in your main application first.');
  }
  app = getApp();
  db = getFirestore(app);
}

// List of quizzes to remove (with possible variations)
const quizzesToRemove = [
  "Quantitative Aptitude Test",
  "Logical Reasoning Challenge",
  "Verbal Ability Assessment",
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
  "Software Engineer",
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Verbal Ability"
];

export async function forceRemoveUnwantedQuizzes() {
  try {
    // Initialize Firebase connection
    initializeFirebase();
    
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

// Run the function if this file is executed directly (Node.js environment only)
if (typeof process !== 'undefined' && process.argv && import.meta.url === `file://${process.argv[1]}`) {
  forceRemoveUnwantedQuizzes()
    .then(result => {
      console.log('Removal completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Removal failed:', error);
      process.exit(1);
    });
}

export default { forceRemoveUnwantedQuizzes };