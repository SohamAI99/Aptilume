// Utility to create a test quiz with sample questions
import { db, auth } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Sample quiz data
const sampleQuiz = {
  title: "General Knowledge Test",
  description: "A comprehensive test of general knowledge across various subjects",
  difficulty: "Medium",
  duration: 30, // 30 minutes
  questionCount: 10,
  category: "General",
  tags: ["general-knowledge", "mixed-subjects", "test-quiz"],
  isPublished: true,
  isRecommended: true
};

// Sample questions data
const sampleQuestions = [
  {
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France.",
    difficulty: "Easy",
    category: "Geography",
    topic: "European Capitals",
    marks: 4
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is often referred to as the 'Red Planet' because of its reddish appearance.",
    difficulty: "Easy",
    category: "Science",
    topic: "Solar System",
    marks: 4
  },
  {
    text: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    explanation: "The blue whale is the largest mammal and the largest animal ever to have lived on Earth.",
    difficulty: "Medium",
    category: "Biology",
    topic: "Animal Kingdom",
    marks: 4
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    explanation: "William Shakespeare wrote the famous tragedy 'Romeo and Juliet' in the late 16th century.",
    difficulty: "Easy",
    category: "Literature",
    topic: "Shakespeare",
    marks: 4
  },
  {
    text: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    explanation: "The chemical symbol for gold is Au, which comes from the Latin word 'aurum'.",
    difficulty: "Medium",
    category: "Chemistry",
    topic: "Periodic Table",
    marks: 4
  },
  {
    text: "Which is the longest river in the world?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correctAnswer: 1,
    explanation: "The Nile River is traditionally considered the world's longest river at approximately 4,135 miles.",
    difficulty: "Medium",
    category: "Geography",
    topic: "World Rivers",
    marks: 4
  },
  {
    text: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 1,
    explanation: "The square root of 144 is 12, because 12 × 12 = 144.",
    difficulty: "Easy",
    category: "Mathematics",
    topic: "Arithmetic",
    marks: 4
  },
  {
    text: "Which gas makes up about 78% of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2,
    explanation: "Nitrogen makes up approximately 78% of Earth's atmosphere, while oxygen makes up about 21%.",
    difficulty: "Medium",
    category: "Science",
    topic: "Atmosphere",
    marks: 4
  },
  {
    text: "In which year did World War II end?",
    options: ["1943", "1945", "1947", "1950"],
    correctAnswer: 1,
    explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in August.",
    difficulty: "Easy",
    category: "History",
    topic: "World War II",
    marks: 4
  },
  {
    text: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: 1,
    explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP).",
    difficulty: "Medium",
    category: "Biology",
    topic: "Cell Biology",
    marks: 4
  }
];

// Function to create a test quiz with questions
export const createTestQuiz = async () => {
  try {
    console.log('Creating test quiz...');
    
    // Create the quiz
    const quizRef = doc(collection(db, 'quizzes'));
    const quizData = {
      ...sampleQuiz,
      createdBy: auth.currentUser?.uid || 'test-user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      stats: {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0
      }
    };
    
    await setDoc(quizRef, quizData);
    console.log(`Created quiz with ID: ${quizRef.id}`);
    
    // Add questions to the quiz
    for (let i = 0; i < sampleQuestions.length; i++) {
      const question = sampleQuestions[i];
      
      // Add question to the quiz's questions subcollection
      const questionRef = doc(collection(db, 'quizzes', quizRef.id, 'questions'));
      await setDoc(questionRef, {
        ...question,
        createdAt: serverTimestamp()
      });
      
      console.log(`Added question ${i + 1}: ${question.text}`);
    }
    
    console.log(`Successfully created test quiz with ${sampleQuestions.length} questions`);
    console.log(`Quiz ID: ${quizRef.id}`);
    
    return quizRef.id;
  } catch (error) {
    console.error('Error creating test quiz:', error);
    throw error;
  }
};

// Function to create multiple test quizzes
export const createMultipleTestQuizzes = async (count = 3) => {
  try {
    console.log(`Creating ${count} test quizzes...`);
    
    const quizIds = [];
    
    for (let i = 0; i < count; i++) {
      const quizId = await createTestQuiz();
      quizIds.push(quizId);
      console.log(`Created quiz ${i + 1} with ID: ${quizId}`);
    }
    
    console.log(`Successfully created ${count} test quizzes`);
    return quizIds;
  } catch (error) {
    console.error('Error creating multiple test quizzes:', error);
    throw error;
  }
};

export default { createTestQuiz, createMultipleTestQuizzes };