import { getApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

// New quizzes to add
const newQuizzes = [
  {
    title: "Microsoft Technical Interview Prep",
    description: "Practice test focusing on technical concepts, coding challenges, and behavioral questions commonly asked at Microsoft.",
    duration: 60,
    questionCount: 51,
    difficulty: "Medium",
    companies: ["Microsoft"],
    category: "Technical Interview",
    isPublished: true,
    isRecommended: true,
    tags: ["microsoft", "technical-interview", "coding", "behavioral"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      passRate: 0
    }
  },
  {
    title: "Meta Product Sense Assessment",
    description: "Evaluate your product thinking and design skills with scenarios and challenges typical at Meta.",
    duration: 45,
    questionCount: 30,
    difficulty: "Hard",
    companies: ["Meta"],
    category: "Product Sense",
    isPublished: true,
    isRecommended: true,
    tags: ["meta", "product-sense", "product-design", "interview-prep"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      passRate: 0
    }
  }
];

export async function addNewQuizzes() {
  try {
    // Initialize Firebase connection
    initializeFirebase();
    
    console.log('Adding new quizzes...');
    
    const addedQuizzes = [];
    
    for (const quiz of newQuizzes) {
      try {
        // Add quiz to Firestore
        const quizRef = await addDoc(collection(db, 'quizzes'), quiz);
        console.log(`Added quiz: "${quiz.title}" with ID: ${quizRef.id}`);
        addedQuizzes.push({
          id: quizRef.id,
          title: quiz.title
        });
      } catch (error) {
        console.error(`Error adding quiz "${quiz.title}":`, error);
      }
    }
    
    console.log('Finished adding new quizzes!');
    return { 
      success: true, 
      addedQuizzes: addedQuizzes,
      count: addedQuizzes.length
    };
  } catch (error) {
    console.error('Error adding new quizzes:', error);
    throw error;
  }
}

// Run the function if this file is executed directly (Node.js environment only)
if (typeof process !== 'undefined' && process.argv && import.meta.url === `file://${process.argv[1]}`) {
  addNewQuizzes()
    .then(result => {
      console.log('Addition completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Addition failed:', error);
      process.exit(1);
    });
}

export default { addNewQuizzes };