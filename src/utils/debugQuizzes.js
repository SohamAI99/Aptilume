// Debug script to check what quizzes exist and their exact titles
import { db } from './firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

// List of quizzes we want to check for
const targetQuizzes = [
  "Microsoft Technical Interview Prep",
  "Meta Product Sense Assessment",
  "Startup Technical Challenge",
  "Amazon Leadership Principles Quiz",
  "Google Software Engineer Assessment"
];

async function debugQuizzes() {
  try {
    console.log('Debugging quizzes in the database...');
    
    // List all quizzes with their exact titles
    console.log('\n=== ALL QUIZZES IN DATABASE ===');
    const allQuizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    
    if (allQuizzesSnapshot.empty) {
      console.log('No quizzes found in the database.');
    } else {
      console.log(`Found ${allQuizzesSnapshot.size} total quizzes:`);
      allQuizzesSnapshot.forEach((doc, index) => {
        const quiz = doc.data();
        console.log(`${index + 1}. ID: ${doc.id}`);
        console.log(`   Title: "${quiz.title}"`);
        console.log(`   Description: ${quiz.description}`);
        console.log(`   Question Count: ${quiz.questionCount}`);
        console.log('---');
      });
    }
    
    // Check for each specific quiz
    console.log('\n=== CHECKING FOR TARGET QUIZZES ===');
    for (const quizTitle of targetQuizzes) {
      console.log(`\nChecking for quiz: "${quizTitle}"`);
      
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('title', '==', quizTitle)
      );
      
      const querySnapshot = await getDocs(quizzesQuery);
      
      if (querySnapshot.empty) {
        console.log(`  ❌ Not found`);
      } else {
        console.log(`  ✅ Found ${querySnapshot.size} matching quiz(es):`);
        querySnapshot.forEach((doc) => {
          console.log(`    ID: ${doc.id}`);
        });
      }
    }
    
    // Check for partial matches
    console.log('\n=== CHECKING FOR PARTIAL TITLE MATCHES ===');
    const allQuizzes = [];
    allQuizzesSnapshot.forEach((doc) => {
      allQuizzes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    for (const targetTitle of targetQuizzes) {
      console.log(`\nPartial matches for: "${targetTitle}"`);
      const partialMatches = allQuizzes.filter(quiz => 
        quiz.title && quiz.title.toLowerCase().includes(targetTitle.toLowerCase().substring(0, 5))
      );
      
      if (partialMatches.length === 0) {
        console.log(`  No partial matches found`);
      } else {
        partialMatches.forEach(quiz => {
          console.log(`  "${quiz.title}" (ID: ${quiz.id})`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error debugging quizzes:', error);
  }
}

debugQuizzes();