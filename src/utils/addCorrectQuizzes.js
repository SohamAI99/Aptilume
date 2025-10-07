// Utility to add correct quizzes to the database
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js';

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

export async function addCorrectQuizzes() {
  try {
    console.log('Adding correct quizzes...');
    
    // First, let's remove any existing quizzes with the same titles
    for (const quiz of correctQuizzes) {
      const q = query(collection(db, 'quizzes'), where('title', '==', quiz.title));
      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
        console.log(`Deleted existing quiz: ${quiz.title}`);
      }
    }
    
    // Now add the correct quizzes
    for (const quiz of correctQuizzes) {
      const docRef = await addDoc(collection(db, 'quizzes'), quiz);
      console.log(`Added quiz: ${quiz.title} with ID: ${docRef.id}`);
    }
    
    console.log('Correct quizzes added successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error adding correct quizzes:', error);
    return { success: false, error: error.message };
  }
}

export default { addCorrectQuizzes };