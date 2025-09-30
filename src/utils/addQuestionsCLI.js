#!/usr/bin/env node

// Command-line script to add sample questions to a quiz
import { db } from './firebase.js';
import { collection, getDocs, query, limit, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

// Function to add questions to a quiz
const addSampleQuestionsToQuiz = async (quizId) => {
  try {
    console.log(`Adding sample questions to quiz: ${quizId}`);
    
    for (let i = 0; i < sampleQuestions.length; i++) {
      const question = sampleQuestions[i];
      
      // Add question to the quiz's questions subcollection
      const questionRef = doc(collection(db, 'quizzes', quizId, 'questions'));
      await setDoc(questionRef, {
        ...question,
        createdAt: serverTimestamp()
      });
      
      console.log(`Added question ${i + 1}: ${question.text}`);
    }
    
    console.log(`Successfully added ${sampleQuestions.length} questions to quiz ${quizId}`);
  } catch (error) {
    console.error('Error adding sample questions:', error);
  }
};

// Function to get a quiz ID (gets the first available quiz)
const getFirstQuizId = async () => {
  try {
    const q = query(collection(db, 'quizzes'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No quizzes found in the database');
      return null;
    }
    
    const quizDoc = querySnapshot.docs[0];
    return quizDoc.id;
  } catch (error) {
    console.error('Error getting quiz ID:', error);
    return null;
  }
};

// Main function to run the script
const runAddQuestionsScript = async () => {
  try {
    console.log('Starting to add sample questions...');
    
    // Get the first quiz ID
    const quizId = await getFirstQuizId();
    
    if (!quizId) {
      console.log('No quiz found to add questions to');
      return;
    }
    
    console.log(`Found quiz with ID: ${quizId}`);
    
    // Add sample questions to the quiz
    await addSampleQuestionsToQuiz(quizId);
    
    console.log('Sample questions added successfully!');
  } catch (error) {
    console.error('Error running add questions script:', error);
  }
};

// Run the script if this file is executed directly (Node.js environment only)
if (typeof process !== 'undefined' && process.argv && import.meta.url === `file://${process.argv[1]}`) {
  runAddQuestionsScript();
}

export { addSampleQuestionsToQuiz, getFirstQuizId, runAddQuestionsScript };