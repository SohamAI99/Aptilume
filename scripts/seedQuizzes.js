// Script to seed all quizzes using Node.js Firebase Admin SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

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

// Sample quiz data
const sampleQuizzes = [
  {
    title: "Quantitative Aptitude Mastery",
    description: "Comprehensive assessment covering mathematics, numerical reasoning, and problem-solving skills essential for competitive exams.",
    duration: 60,
    questionCount: 50,
    difficulty: "Medium",
    companies: ["General", "Competitive Exams"],
    category: "Quantitative Aptitude",
    isPublished: true,
    isRecommended: true,
    tags: ["mathematics", "problem-solving", "numerical-reasoning"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Logical Reasoning Challenge",
    description: "Test your logical thinking and analytical skills with puzzles, sequences, and deductive reasoning questions.",
    duration: 45,
    questionCount: 50,
    difficulty: "Hard",
    companies: ["General", "Competitive Exams"],
    category: "Logical Reasoning",
    isPublished: true,
    isRecommended: true,
    tags: ["logical-thinking", "puzzles", "analytical-skills"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Verbal Ability & Reading Comprehension",
    description: "Assess your command of English language, vocabulary, grammar, and reading comprehension skills.",
    duration: 50,
    questionCount: 50,
    difficulty: "Medium",
    companies: ["General", "Competitive Exams"],
    category: "Verbal Ability",
    isPublished: true,
    isRecommended: true,
    tags: ["english", "vocabulary", "grammar", "reading-comprehension"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Data Interpretation & Analysis",
    description: "Evaluate your ability to interpret data from charts, graphs, and tables to make informed decisions.",
    duration: 40,
    questionCount: 50,
    difficulty: "Hard",
    companies: ["General", "Competitive Exams"],
    category: "Data Interpretation",
    isPublished: true,
    isRecommended: false,
    tags: ["data-interpretation", "charts", "graphs", "analysis"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
    }
  },
  {
    title: "Technical Interview Preparation",
    description: "Prepare for technical interviews with questions on algorithms, data structures, and system design.",
    duration: 90,
    questionCount: 50,
    difficulty: "Hard",
    companies: ["Tech Companies", "FAANG"],
    category: "Technical Interview",
    isPublished: true,
    isRecommended: true,
    tags: ["algorithms", "data-structures", "system-design"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0
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
    },
    {
      text: "A sum of money becomes 3 times itself in 12 years at simple interest. What is the rate of interest?",
      options: [
        "12.5%",
        "15%",
        "16.67%",
        "20%"
      ],
      correctAnswer: 2,
      explanation: "Let principal = P. Amount = 3P. Simple Interest = 3P - P = 2P. Rate = (SI × 100)/(P × T) = (2P × 100)/(P × 12) = 16.67%.",
      category: "Simple & Compound Interest",
      difficulty: "Medium",
      marks: 4,
      topic: "Arithmetic"
    },
    {
      text: "What is the probability of getting a sum of 9 from two throws of a dice?",
      options: [
        "1/6",
        "1/8",
        "1/9",
        "1/12"
      ],
      correctAnswer: 2,
      explanation: "Total outcomes = 36. Favorable outcomes for sum 9: (3,6), (4,5), (5,4), (6,3) = 4 outcomes. Probability = 4/36 = 1/9.",
      category: "Probability",
      difficulty: "Medium",
      marks: 4,
      topic: "Quantitative Aptitude"
    },
    {
      text: "If 20% of a = b, then b% of 20 is the same as:",
      options: [
        "4% of a",
        "5% of a",
        "20% of a",
        "None of these"
      ],
      correctAnswer: 0,
      explanation: "20% of a = b => b = 0.2a. b% of 20 = (b/100) × 20 = (0.2a/100) × 20 = 0.04a = 4% of a.",
      category: "Percentages",
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
    },
    {
      text: "Find the odd one out: 3, 5, 11, 14, 17, 21",
      options: [
        "3",
        "11",
        "14",
        "21"
      ],
      correctAnswer: 2,
      explanation: "All numbers except 14 are prime numbers. 14 is not a prime number.",
      category: "Number Series",
      difficulty: "Easy",
      marks: 4,
      topic: "Logical Reasoning"
    },
    {
      text: "If X is the brother of the son of Y's son, how is X related to Y?",
      options: [
        "Son",
        "Brother",
        "Nephew",
        "Grandson"
      ],
      correctAnswer: 3,
      explanation: "Y's son is the father of X's brother. So Y's son is X's father. Therefore, X is the son of Y's son, which makes X the grandson of Y.",
      category: "Blood Relations",
      difficulty: "Medium",
      marks: 4,
      topic: "Logical Reasoning"
    },
    {
      text: "In a row of trees, one tree is fifth from either end of the row. How many trees are there in the row?",
      options: [
        "8",
        "9",
        "10",
        "11"
      ],
      correctAnswer: 1,
      explanation: "If a tree is fifth from either end, there are 4 trees on one side and 4 trees on the other side. Total = 4 + 1 + 4 = 9 trees.",
      category: "Seating Arrangement",
      difficulty: "Easy",
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
    },
    {
      text: "Which of the following sentences is grammatically correct?",
      options: [
        "The number of students are increasing.",
        "The number of students is increasing.",
        "The numbers of students are increasing.",
        "The numbers of students is increasing."
      ],
      correctAnswer: 1,
      explanation: "When 'number' is used with 'the', it takes a singular verb. So 'the number of students is increasing' is correct.",
      category: "Grammar",
      difficulty: "Easy",
      marks: 4,
      topic: "Verbal Ability"
    },
    {
      text: "Identify the error in the sentence: 'Each of the students have finished their homework.'",
      options: [
        "Each of the students",
        "have finished",
        "their homework",
        "No error"
      ],
      correctAnswer: 1,
      explanation: "When 'each' is used as a subject, it takes a singular verb. So 'have' should be 'has'.",
      category: "Error Spotting",
      difficulty: "Medium",
      marks: 4,
      topic: "Verbal Ability"
    },
    {
      text: "Fill in the blank: The _______ of the new policy was immediately felt by the employees.",
      options: [
        "affect",
        "effect",
        "impact",
        "result"
      ],
      correctAnswer: 1,
      explanation: "Effect is a noun meaning a change that results from an action. Here we need a noun, so 'effect' is correct.",
      category: "Fill in the Blanks",
      difficulty: "Easy",
      marks: 4,
      topic: "Verbal Ability"
    }
  ],
  // Data Interpretation & Analysis questions
  3: [
    {
      text: "[Based on a bar chart showing sales of different products over 5 years] In which year was the percentage increase in sales of Product A the highest compared to the previous year?",
      options: [
        "Year 2",
        "Year 3",
        "Year 4",
        "Year 5"
      ],
      correctAnswer: 1,
      explanation: "To find the percentage increase, we calculate ((Current Year Sales - Previous Year Sales)/Previous Year Sales) × 100 for each year and compare.",
      category: "Bar Graphs",
      difficulty: "Hard",
      marks: 4,
      topic: "Data Interpretation"
    },
    {
      text: "[Based on a pie chart showing market share of different companies] If the total market size is $10 million, what is the revenue of Company C?",
      options: [
        "$1.5 million",
        "$2 million",
        "$2.5 million",
        "$3 million"
      ],
      correctAnswer: 2,
      explanation: "If Company C has 25% market share, its revenue = 25% of $10 million = $2.5 million.",
      category: "Pie Charts",
      difficulty: "Medium",
      marks: 4,
      topic: "Data Interpretation"
    }
  ],
  // Technical Interview Preparation questions
  4: [
    {
      text: "What is the time complexity of searching for an element in a balanced binary search tree?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)"
      ],
      correctAnswer: 1,
      explanation: "In a balanced binary search tree, the height is log n, and searching involves traversing from root to leaf, which takes O(log n) time.",
      category: "Data Structures",
      difficulty: "Medium",
      marks: 4,
      topic: "Algorithms"
    },
    {
      text: "Which data structure is most appropriate for implementing a function call stack?",
      options: [
        "Queue",
        "Stack",
        "Array",
        "Linked List"
      ],
      correctAnswer: 1,
      explanation: "Function call stack follows LIFO (Last In, First Out) principle, which is exactly how a stack data structure works.",
      category: "Data Structures",
      difficulty: "Easy",
      marks: 4,
      topic: "Data Structures"
    },
    {
      text: "What is the primary advantage of using a hash table?",
      options: [
        "Ordered storage",
        "Fast access time",
        "Memory efficiency",
        "Sorted elements"
      ],
      correctAnswer: 1,
      explanation: "Hash tables provide average O(1) time complexity for search, insert, and delete operations, making them very efficient for fast access.",
      category: "Data Structures",
      difficulty: "Easy",
      marks: 4,
      topic: "Data Structures"
    },
    {
      text: "In object-oriented programming, what does 'inheritance' allow?",
      options: [
        "Creating multiple instances of a class",
        "Reusing code from parent classes",
        "Hiding implementation details",
        "Defining multiple methods with the same name"
      ],
      correctAnswer: 1,
      explanation: "Inheritance allows a class to inherit properties and methods from another class, promoting code reusability.",
      category: "Object-Oriented Programming",
      difficulty: "Easy",
      marks: 4,
      topic: "Programming Concepts"
    },
    {
      text: "What is the purpose of a database index?",
      options: [
        "To store data in a sorted order",
        "To improve query performance",
        "To reduce storage space",
        "To enforce data integrity"
      ],
      correctAnswer: 1,
      explanation: "Database indexes are used to speed up data retrieval operations by creating a data structure that allows faster lookups.",
      category: "Databases",
      difficulty: "Medium",
      marks: 4,
      topic: "Database Management"
    }
  ]
};

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
      const totalQuestionsNeeded = 50;
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
    console.log('Seeding all quizzes...');
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