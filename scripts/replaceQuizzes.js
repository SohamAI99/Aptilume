// Script to replace quizzes with correct data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, updateDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';

// Firebase config (same as in .env)
const firebaseConfig = {
  apiKey: "AIzaSyA4LziZrzJH428rCYEPaojdrsjgcGRDwCw",
  authDomain: "qkie-34136.firebaseapp.com",
  projectId: "qkie-34136",
  storageBucket: "qkie-34136.appspot.com",
  messagingSenderId: "399296096924",
  appId: "1:399296096924:web:1958478e9ab011e799db59",
  measurementId: "G-MDSK70WS4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Correct quiz data that should be in the database
const correctQuizzes = [
  {
    title: "Quantitative Aptitude Test",
    description: "Comprehensive assessment of mathematical reasoning and problem-solving skills",
    duration: 30,
    questionCount: 25,
    difficulty: "Medium",
    companies: ["General"],
    category: "Quantitative Aptitude",
    isPublished: true,
    isRecommended: true,
    tags: ["mathematics", "problem-solving", "numerical-reasoning"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 124,
      averageScore: 68,
      highestScore: 95,
      passRate: 72
    }
  },
  {
    title: "Logical Reasoning Challenge",
    description: "Test your analytical and logical thinking abilities",
    duration: 25,
    questionCount: 20,
    difficulty: "Hard",
    companies: ["TechCorp"],
    category: "Logical Reasoning",
    isPublished: true,
    isRecommended: true,
    tags: ["logical-thinking", "puzzles", "analytical-skills"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 89,
      averageScore: 55,
      highestScore: 88,
      passRate: 65
    }
  },
  {
    title: "Verbal Ability Assessment",
    description: "Evaluate your command of English language, vocabulary, grammar, and reading comprehension skills",
    duration: 35,
    questionCount: 30,
    difficulty: "Medium",
    companies: ["General"],
    category: "Verbal Ability",
    isPublished: true,
    isRecommended: true,
    tags: ["english", "vocabulary", "grammar", "reading-comprehension"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 156,
      averageScore: 62,
      highestScore: 92,
      passRate: 68
    }
  }
];

async function deleteAllQuizzes() {
  try {
    console.log('Deleting all existing quizzes...');
    
    // Get all quizzes
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    
    // Delete all quizzes and their questions
    for (const docSnapshot of quizzesSnapshot.docs) {
      const quizId = docSnapshot.id;
      console.log(`Deleting quiz: ${docSnapshot.data().title} (ID: ${quizId})`);
      
      // First, delete all questions in the quiz's subcollection
      try {
        const questionsQuery = query(collection(db, 'quizzes', quizId, 'questions'));
        const questionsSnapshot = await getDocs(questionsQuery);
        
        console.log(`  Deleting ${questionsSnapshot.size} questions for quiz ${quizId}`);
        
        for (const questionDoc of questionsSnapshot.docs) {
          await deleteDoc(questionDoc.ref);
        }
        
        console.log(`  Deleted all questions for quiz ${quizId}`);
      } catch (questionsError) {
        console.error(`  Error deleting questions for quiz ${quizId}:`, questionsError);
      }
      
      // Then delete the quiz document itself
      await deleteDoc(docSnapshot.ref);
      console.log(`  Deleted quiz: ${docSnapshot.data().title} (ID: ${quizId})`);
    }
    
    console.log('Finished deleting all quizzes!');
  } catch (error) {
    console.error('Error deleting quizzes:', error);
    throw error;
  }
}

async function seedCorrectQuizzes() {
  try {
    console.log('Seeding correct quizzes...');
    
    for (let i = 0; i < correctQuizzes.length; i++) {
      const quiz = correctQuizzes[i];
      
      // Add quiz to Firestore
      const quizRef = await addDoc(collection(db, 'quizzes'), quiz);
      console.log(`Added quiz: ${quiz.title} with ID: ${quizRef.id}`);
    }
    
    console.log('Correct quizzes seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding correct quizzes:', error);
    throw error;
  }
}

async function replaceQuizzes() {
  try {
    console.log('Starting quiz replacement process...');
    await deleteAllQuizzes();
    await seedCorrectQuizzes();
    console.log('Quiz replacement completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error replacing quizzes:', error);
    process.exit(1);
  }
}

// Run the replacement function
replaceQuizzes();