// Utility to create an Aptitude Test quiz with the questions you provided
import { db, auth } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// Aptitude Test quiz data
const aptitudeQuiz = {
  title: "Aptitude Test",
  description: "Comprehensive aptitude test covering quantitative, logical reasoning, verbal ability, and data interpretation.",
  difficulty: "Medium",
  duration: 60, // 60 minutes
  questionCount: 20,
  category: "General Aptitude",
  tags: ["aptitude", "quantitative", "reasoning", "verbal", "data-interpretation"],
  isPublished: true,
  isRecommended: true
};

// Aptitude Test questions (the ones you provided)
const aptitudeQuestions = [
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
    difficulty: "Medium",
    category: "Time, Speed & Distance",
    topic: "Arithmetic",
    marks: 4
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
    difficulty: "Hard",
    category: "Number System",
    topic: "Arithmetic",
    marks: 4
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
    difficulty: "Medium",
    category: "Simple & Compound Interest",
    topic: "Arithmetic",
    marks: 4
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
    difficulty: "Medium",
    category: "Probability",
    topic: "Quantitative Aptitude",
    marks: 4
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
    difficulty: "Hard",
    category: "Percentages",
    topic: "Arithmetic",
    marks: 4
  },
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
    difficulty: "Hard",
    category: "Blood Relations",
    topic: "Logical Reasoning",
    marks: 4
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
    difficulty: "Medium",
    category: "Coding-Decoding",
    topic: "Logical Reasoning",
    marks: 4
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
    difficulty: "Easy",
    category: "Number Series",
    topic: "Logical Reasoning",
    marks: 4
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
    difficulty: "Medium",
    category: "Blood Relations",
    topic: "Logical Reasoning",
    marks: 4
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
    difficulty: "Easy",
    category: "Seating Arrangement",
    topic: "Logical Reasoning",
    marks: 4
  },
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
    difficulty: "Medium",
    category: "Synonyms",
    topic: "Verbal Ability",
    marks: 4
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
    difficulty: "Medium",
    category: "Antonyms",
    topic: "Verbal Ability",
    marks: 4
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
    difficulty: "Easy",
    category: "Grammar",
    topic: "Verbal Ability",
    marks: 4
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
    difficulty: "Medium",
    category: "Error Spotting",
    topic: "Verbal Ability",
    marks: 4
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
    difficulty: "Easy",
    category: "Fill in the Blanks",
    topic: "Verbal Ability",
    marks: 4
  },
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
    difficulty: "Hard",
    category: "Bar Graphs",
    topic: "Data Interpretation",
    marks: 4
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
    difficulty: "Medium",
    category: "Pie Charts",
    topic: "Data Interpretation",
    marks: 4
  },
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
    difficulty: "Medium",
    category: "Data Structures",
    topic: "Algorithms",
    marks: 4
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
    difficulty: "Easy",
    category: "Data Structures",
    topic: "Data Structures",
    marks: 4
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
    difficulty: "Easy",
    category: "Data Structures",
    topic: "Data Structures",
    marks: 4
  }
];

// Function to find existing Aptitude quiz or create a new one
export const createOrUpdateAptitudeQuiz = async () => {
  try {
    console.log('Looking for existing Aptitude Test quiz...');
    
    // First, check if a quiz with this title already exists
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('title', '==', 'Aptitude Test')
    );
    
    const querySnapshot = await getDocs(quizzesQuery);
    
    let quizId;
    
    if (!querySnapshot.empty) {
      // Quiz already exists, use the first one found
      const existingQuiz = querySnapshot.docs[0];
      quizId = existingQuiz.id;
      console.log(`Found existing Aptitude quiz with ID: ${quizId}`);
      
      // Update the existing quiz with the latest data
      await setDoc(doc(db, 'quizzes', quizId), {
        ...aptitudeQuiz,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } else {
      // Create a new quiz
      console.log('Creating new Aptitude Test quiz...');
      
      const quizRef = doc(collection(db, 'quizzes'));
      const quizData = {
        ...aptitudeQuiz,
        createdBy: auth.currentUser?.uid || 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0
        }
      };
      
      await setDoc(quizRef, quizData);
      quizId = quizRef.id;
      console.log(`Created new Aptitude quiz with ID: ${quizId}`);
    }
    
    // Clear existing questions (if any) and add new ones
    console.log('Adding Aptitude Test questions...');
    
    // Add questions to the quiz
    for (let i = 0; i < aptitudeQuestions.length; i++) {
      const question = aptitudeQuestions[i];
      
      // Add question to the quiz's questions subcollection
      const questionRef = doc(collection(db, 'quizzes', quizId, 'questions'));
      await setDoc(questionRef, {
        ...question,
        createdAt: serverTimestamp()
      });
      
      console.log(`Added question ${i + 1}: ${question.text.substring(0, 50)}...`);
    }
    
    // Update the quiz with the correct question count
    await setDoc(doc(db, 'quizzes', quizId), {
      questionCount: aptitudeQuestions.length,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log(`Successfully created/updated Aptitude Test quiz with ${aptitudeQuestions.length} questions`);
    console.log(`Quiz ID: ${quizId}`);
    
    return quizId;
  } catch (error) {
    console.error('Error creating/updating Aptitude quiz:', error);
    throw error;
  }
};

export default { createOrUpdateAptitudeQuiz };