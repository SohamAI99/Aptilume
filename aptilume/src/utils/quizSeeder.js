// Quiz Seeder - Creates sample quiz data for development and testing
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.js';

// Sample quiz data
const sampleQuizzes = [
  {
    title: "Google Software Engineer Assessment",
    description: "Comprehensive coding and problem-solving test covering algorithms, data structures, and system design fundamentals.",
    duration: 90,
    questionCount: 45,
    difficulty: "Hard",
    companies: ["Google", "FAANG"],
    category: "Software Engineering",
    isPublished: true,
    isRecommended: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Microsoft Technical Interview Prep",
    description: "Practice test focusing on technical concepts, coding challenges, and behavioral questions commonly asked at Microsoft.",
    duration: 60,
    questionCount: 30,
    difficulty: "Medium",
    companies: ["Microsoft", "FAANG"],
    category: "Technical Interview",
    isPublished: true,
    isRecommended: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Amazon Leadership Principles Quiz",
    description: "Assessment based on Amazon's 16 leadership principles with scenario-based questions and case studies.",
    duration: 45,
    questionCount: 25,
    difficulty: "Easy",
    companies: ["Amazon", "FAANG"],
    category: "Leadership",
    isPublished: true,
    isRecommended: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Meta Product Sense Assessment",
    description: "Product management and analytical thinking test designed for Meta's product roles and technical positions.",
    duration: 75,
    questionCount: 35,
    difficulty: "Hard",
    companies: ["Meta", "FAANG"],
    category: "Product Management",
    isPublished: true,
    isRecommended: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Startup Technical Challenge",
    description: "General technical assessment covering full-stack development, problem-solving, and startup mindset evaluation.",
    duration: 120,
    questionCount: 50,
    difficulty: "Medium",
    companies: ["Mango"],
    category: "General",
    isPublished: true,
    isRecommended: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  }
];

// Sample questions for each quiz
const sampleQuestions = {
  // Google Software Engineer Assessment questions
  0: [
    {
      question: "What is the time complexity of binary search in a sorted array?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctAnswer: 1,
      explanation: "Binary search has a time complexity of O(log n) because it halves the search space with each iteration.",
      category: "Algorithms",
      difficulty: "Medium"
    },
    {
      question: "Which data structure uses LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "A stack follows the LIFO principle where the last element added is the first one to be removed.",
      category: "Data Structures",
      difficulty: "Easy"
    }
  ],
  // Microsoft Technical Interview Prep questions
  1: [
    {
      question: "What does CORS stand for?",
      options: [
        "Cross-Origin Resource Sharing",
        "Cross-Origin Request Security",
        "Cross-Origin Response System",
        "Cross-Origin Resource Security"
      ],
      correctAnswer: 0,
      explanation: "CORS stands for Cross-Origin Resource Sharing, a mechanism that allows restricted resources to be requested from another domain.",
      category: "Web Development",
      difficulty: "Medium"
    }
  ],
  // Amazon Leadership Principles Quiz questions
  2: [
    {
      question: "Which Amazon leadership principle emphasizes ownership and long-term thinking?",
      options: [
        "Customer Obsession",
        "Ownership",
        "Invent and Simplify",
        "Learn and Be Curious"
      ],
      correctAnswer: 1,
      explanation: "The Ownership principle at Amazon means thinking long-term and not sacrificing long-term value for short-term results.",
      category: "Leadership",
      difficulty: "Easy"
    }
  ],
  // Meta Product Sense Assessment questions
  3: [
    {
      question: "What is the primary goal of a product requirement document (PRD)?",
      options: [
        "To specify technical implementation details",
        "To define the product's features and functionality",
        "To outline marketing strategies",
        "To set financial targets"
      ],
      correctAnswer: 1,
      explanation: "A PRD defines what the product should do, including its features, functionality, and user experience requirements.",
      category: "Product Management",
      difficulty: "Medium"
    }
  ],
  // Startup Technical Challenge questions
  4: [
    {
      question: "What is the main advantage of using a microservices architecture?",
      options: [
        "Simpler deployment",
        "Better scalability and maintainability",
        "Reduced development time",
        "Lower hardware costs"
      ],
      correctAnswer: 1,
      explanation: "Microservices architecture allows for better scalability and maintainability by breaking down applications into smaller, independent services.",
      category: "System Design",
      difficulty: "Hard"
    }
  ]
};

export const seedQuizzes = async () => {
  try {
    console.log('Seeding quizzes...');
    
    for (let i = 0; i < sampleQuizzes.length; i++) {
      const quiz = sampleQuizzes[i];
      
      // Add quiz to Firestore
      const quizRef = await addDoc(collection(db, 'quizzes'), quiz);
      console.log(`Added quiz: ${quiz.title} with ID: ${quizRef.id}`);
      
      // Add sample questions for this quiz
      const questions = sampleQuestions[i] || [];
      for (const question of questions) {
        await addDoc(collection(db, 'quizzes', quizRef.id, 'questions'), {
          ...question,
          createdAt: serverTimestamp()
        });
      }
      
      console.log(`Added ${questions.length} questions to quiz: ${quiz.title}`);
    }
    
    console.log('Quiz seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding quizzes:', error);
  }
};

export default { seedQuizzes };