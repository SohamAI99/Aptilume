// Script to seed updated quizzes using Node.js Firebase Admin SDK
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

// Sample quiz data with proper stats
const sampleQuizzes = [
  {
    title: "Quantitative Aptitude Mastery",
    description: "Comprehensive assessment covering mathematics, numerical reasoning, and problem-solving skills essential for competitive exams.",
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
    title: "Verbal Ability & Reading Comprehension",
    description: "Assess your command of English language, vocabulary, grammar, and reading comprehension skills.",
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

// Function to generate additional questions for each quiz
const generateAdditionalQuestions = (baseQuestions, count) => {
  const additionalQuestions = [];
  const categories = [
    "Time, Speed & Distance",
    "Number System",
    "Simple & Compound Interest",
    "Probability",
    "Percentages",
    "Profit & Loss",
    "Ratio & Proportion",
    "Algebra",
    "Geometry",
    "Mensuration"
  ];
  
  const difficulties = ["Easy", "Medium", "Hard"];
  const topics = ["Arithmetic", "Quantitative Aptitude", "Mathematics"];
  
  for (let i = 0; i < count; i++) {
    const baseQuestion = baseQuestions[i % baseQuestions.length];
    const newQuestion = {
      ...baseQuestion,
      text: `${baseQuestion.text} - Variant ${Math.floor(i/5) + 1}`,
      options: [...baseQuestion.options].sort(() => Math.random() - 0.5), // Shuffle options
      correctAnswer: Math.floor(Math.random() * 4), // Random correct answer
      category: categories[Math.floor(Math.random() * categories.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      topic: topics[Math.floor(Math.random() * topics.length)],
      marks: 4
    };
    additionalQuestions.push(newQuestion);
  }
  
  return additionalQuestions;
};

// Comprehensive questions for each quiz
const sampleQuestions = {
  // Quantitative Aptitude Mastery questions
  0: [
    {
      text: "A train 150 meters long is running at a speed of 90 km/hr. How long will it take to cross a bridge 300 meters long?",
      options: [
        "15 seconds",
        "18 seconds",
        "20 seconds",
        "25 seconds"
      ],
      correctAnswer: 1,
      explanation: "Total distance = 150 + 300 = 450 meters. Speed = 90 km/hr = 25 m/s. Time = Distance/Speed = 450/25 = 18 seconds.",
      category: "Time, Speed & Distance",
      difficulty: "Medium",
      marks: 4,
      topic: "Arithmetic"
    },
    {
      text: "If the ratio of two numbers is 3:4 and their HCF is 4, what is their LCM?",
      options: [
        "12",
        "16",
        "24",
        "48"
      ],
      correctAnswer: 3,
      explanation: "Let the numbers be 3x and 4x. HCF = x = 4. So numbers are 12 and 16. LCM = (12 × 16)/HCF = (12 × 16)/4 = 48.",
      category: "Number System",
      difficulty: "Hard",
      marks: 4,
      topic: "Arithmetic"
    }
  ],
  // Logical Reasoning Challenge questions
  1: [
    {
      text: "If 'P $ Q' means 'P is the father of Q'; 'P # Q' means 'P is the mother of Q'; 'P * Q' means 'P is the sister of Q', then how is D related to N in N # A $ B * D?",
      options: [
        "Nephew",
        "Grandson",
        "Granddaughter",
        "Cannot be determined"
      ],
      correctAnswer: 2,
      explanation: "N # A means N is the mother of A. A $ B means A is the father of B. B * D means B is the sister of D. So D is the child of A and grandchild of N. Since B is sister of D, D is granddaughter of N.",
      category: "Blood Relations",
      difficulty: "Hard",
      marks: 4,
      topic: "Logical Reasoning"
    },
    {
      text: "In a certain code, '3579' means 'paint is very fresh', '5462' means 'paint is good', '6183' means 'fresh and good'. Which digit stands for 'very'?",
      options: [
        "3",
        "5",
        "7",
        "9"
      ],
      correctAnswer: 2,
      explanation: "From first two codes, 5 means 'paint' and 3 means 'fresh'. From first and third codes, 3 means 'fresh' and 6 means 'good'. So 7 stands for 'very'.",
      category: "Coding-Decoding",
      difficulty: "Medium",
      marks: 4,
      topic: "Logical Reasoning"
    }
  ],
  // Verbal Ability & Reading Comprehension questions
  2: [
    {
      text: "Choose the word most similar in meaning to 'EMBEZZLE':",
      options: [
        "Steal",
        "Misappropriate",
        "Snatch",
        "Rob"
      ],
      correctAnswer: 1,
      explanation: "Embezzle means to steal or misappropriate money placed in one's trust or belonging to one's employer. Misappropriate is the closest synonym.",
      category: "Synonyms",
      difficulty: "Medium",
      marks: 4,
      topic: "Verbal Ability"
    },
    {
      text: "Choose the word most opposite in meaning to 'OSTENTATIOUS':",
      options: [
        "Showy",
        "Flamboyant",
        "Modest",
        "Gaudy"
      ],
      correctAnswer: 2,
      explanation: "Ostentatious means characterized by vulgar or pretentious display; designed to impress. Modest is the opposite, meaning unassuming or moderate.",
      category: "Antonyms",
      difficulty: "Medium",
      marks: 4,
      topic: "Verbal Ability"
    }
  ]
};

async function deleteExistingQuizzes() {
  try {
    console.log('Deleting existing quizzes...');
    
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
    
    console.log('Finished deleting existing quizzes!');
  } catch (error) {
    console.error('Error deleting existing quizzes:', error);
    throw error;
  }
}

async function seedQuizzes() {
  try {
    console.log('Seeding quizzes...');
    
    for (let i = 0; i < sampleQuizzes.length; i++) {
      const quiz = sampleQuizzes[i];
      
      // Add quiz to Firestore
      const quizRef = await addDoc(collection(db, 'quizzes'), quiz);
      console.log(`Added quiz: ${quiz.title} with ID: ${quizRef.id}`);
      
      // Get base questions for this quiz
      const baseQuestions = sampleQuestions[i] || [];
      
      // Generate additional questions to reach 50 total
      const totalQuestionsNeeded = quiz.questionCount;
      const additionalQuestions = generateAdditionalQuestions(baseQuestions, totalQuestionsNeeded - baseQuestions.length);
      const allQuestions = [...baseQuestions, ...additionalQuestions];
      
      // Add all questions for this quiz
      for (const question of allQuestions) {
        await addDoc(collection(db, 'quizzes', quizRef.id, 'questions'), {
          ...question,
          createdAt: serverTimestamp()
        });
      }
      
      // Update quiz with actual question count
      await updateDoc(quizRef, {
        questionCount: allQuestions.length
      });
      
      console.log(`Added ${allQuestions.length} questions to quiz: ${quiz.title}`);
    }
    
    console.log('Quiz seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    throw error;
  }
}

async function seedAllQuizzes() {
  try {
    console.log('Starting quiz seeding process...');
    await deleteExistingQuizzes();
    await seedQuizzes();
    console.log('All quizzes seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAllQuizzes();