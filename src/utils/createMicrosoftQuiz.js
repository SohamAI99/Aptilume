// Utility to create a Microsoft Technical Interview Prep quiz
import { db, auth } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// Microsoft Technical Interview Prep quiz data
const microsoftQuiz = {
  title: "Microsoft Technical Interview Prep",
  description: "Prepare for Microsoft technical interviews with questions on data structures, algorithms, and system design.",
  difficulty: "Hard",
  duration: 90, // 90 minutes
  questionCount: 20,
  category: "Technical Interview",
  tags: ["microsoft", "technical-interview", "data-structures", "algorithms", "system-design"],
  isPublished: true,
  isRecommended: true
};

// Microsoft Technical Interview questions
const microsoftQuestions = [
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
    topic: "Binary Search Trees",
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
    topic: "Stacks",
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
    topic: "Hash Tables",
    marks: 4
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
    difficulty: "Easy",
    category: "Object-Oriented Programming",
    topic: "Inheritance",
    marks: 4
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
    difficulty: "Medium",
    category: "Databases",
    topic: "Database Indexes",
    marks: 4
  },
  {
    text: "What is the difference between process and thread?",
    options: [
      "Process is faster than thread",
      "Thread is faster than process",
      "Process is a program in execution, thread is a lightweight process",
      "There is no difference"
    ],
    correctAnswer: 2,
    explanation: "A process is a program in execution with its own memory space, while a thread is a lightweight subprocess that shares the memory space of its parent process.",
    difficulty: "Medium",
    category: "Operating Systems",
    topic: "Processes and Threads",
    marks: 4
  },
  {
    text: "Which sorting algorithm has the best average-case time complexity?",
    options: [
      "Bubble Sort",
      "Quick Sort",
      "Merge Sort",
      "Selection Sort"
    ],
    correctAnswer: 2,
    explanation: "Merge Sort has a consistent O(n log n) time complexity in all cases, making it one of the most reliable sorting algorithms.",
    difficulty: "Medium",
    category: "Algorithms",
    topic: "Sorting Algorithms",
    marks: 4
  },
  {
    text: "What is the time complexity of Dijkstra's algorithm using a binary heap?",
    options: [
      "O(V)",
      "O(E)",
      "O(V + E log V)",
      "O(V^2)"
    ],
    correctAnswer: 2,
    explanation: "With a binary heap, Dijkstra's algorithm has a time complexity of O(V + E log V), where V is the number of vertices and E is the number of edges.",
    difficulty: "Hard",
    category: "Algorithms",
    topic: "Graph Algorithms",
    marks: 4
  },
  {
    text: "What is a deadlock in operating systems?",
    options: [
      "A system crash",
      "A situation where two or more processes wait for each other to release resources",
      "A memory overflow",
      "A network failure"
    ],
    correctAnswer: 1,
    explanation: "A deadlock occurs when two or more processes are waiting indefinitely for each other to release resources they need.",
    difficulty: "Medium",
    category: "Operating Systems",
    topic: "Deadlocks",
    marks: 4
  },
  {
    text: "What is the primary purpose of a virtual destructor in C++?",
    options: [
      "To save memory",
      "To enable polymorphism",
      "To ensure proper cleanup of derived class objects",
      "To improve performance"
    ],
    correctAnswer: 2,
    explanation: "A virtual destructor ensures that the destructor of the derived class is called when an object is deleted through a base class pointer, preventing memory leaks.",
    difficulty: "Medium",
    category: "Programming Languages",
    topic: "C++",
    marks: 4
  },
  {
    text: "What is the time complexity of accessing an element in an array by index?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n^2)"
    ],
    correctAnswer: 0,
    explanation: "Arrays provide direct access to elements by index, which takes constant time O(1).",
    difficulty: "Easy",
    category: "Data Structures",
    topic: "Arrays",
    marks: 4
  },
  {
    text: "Which HTTP method is idempotent?",
    options: [
      "POST",
      "GET",
      "PUT",
      "Both GET and PUT"
    ],
    correctAnswer: 3,
    explanation: "Both GET and PUT are idempotent HTTP methods. GET requests should not change server state, and PUT requests should produce the same result regardless of how many times they are executed.",
    difficulty: "Medium",
    category: "Web Development",
    topic: "HTTP Methods",
    marks: 4
  },
  {
    text: "What is the CAP theorem in distributed systems?",
    options: [
      "Consistency, Availability, Partition tolerance - you can only have two",
      "Concurrency, Atomicity, Persistence - you can only have two",
      "Correctness, Accessibility, Performance - you can only have two",
      "Consistency, Accuracy, Performance - you can only have two"
    ],
    correctAnswer: 0,
    explanation: "The CAP theorem states that in a distributed system, you can only guarantee two of the following three: Consistency, Availability, and Partition tolerance.",
    difficulty: "Hard",
    category: "Distributed Systems",
    topic: "CAP Theorem",
    marks: 4
  },
  {
    text: "What is the difference between TCP and UDP?",
    options: [
      "TCP is faster than UDP",
      "UDP is connection-oriented, TCP is connectionless",
      "TCP is connection-oriented, UDP is connectionless",
      "There is no significant difference"
    ],
    correctAnswer: 2,
    explanation: "TCP (Transmission Control Protocol) is connection-oriented and provides reliable data transmission, while UDP (User Datagram Protocol) is connectionless and provides faster but unreliable transmission.",
    difficulty: "Medium",
    category: "Networking",
    topic: "TCP/IP",
    marks: 4
  },
  {
    text: "What is the purpose of a load balancer?",
    options: [
      "To increase security",
      "To distribute network traffic across multiple servers",
      "To compress data",
      "To encrypt communications"
    ],
    correctAnswer: 1,
    explanation: "A load balancer distributes incoming network requests across multiple servers to ensure no single server is overwhelmed, improving performance and availability.",
    difficulty: "Medium",
    category: "System Design",
    topic: "Load Balancing",
    marks: 4
  },
  {
    text: "What is the time complexity of binary search?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation: "Binary search has a time complexity of O(log n) because it eliminates half of the remaining elements with each comparison.",
    difficulty: "Easy",
    category: "Algorithms",
    topic: "Searching Algorithms",
    marks: 4
  },
  {
    text: "What is a closure in JavaScript?",
    options: [
      "A function that has been closed",
      "A function that has access to variables from its outer scope even after the outer function has returned",
      "A function that takes no parameters",
      "A function that returns a value"
    ],
    correctAnswer: 1,
    explanation: "A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has finished executing.",
    difficulty: "Medium",
    category: "Programming Languages",
    topic: "JavaScript",
    marks: 4
  },
  {
    text: "What is the difference between deep copy and shallow copy?",
    options: [
      "Deep copy is faster than shallow copy",
      "Shallow copy copies only the reference, deep copy copies the actual object",
      "Deep copy copies only the reference, shallow copy copies the actual object",
      "There is no difference"
    ],
    correctAnswer: 1,
    explanation: "A shallow copy creates a new object but copies references to the original nested objects. A deep copy creates a new object and recursively copies all nested objects as well.",
    difficulty: "Medium",
    category: "Programming Concepts",
    topic: "Memory Management",
    marks: 4
  },
  {
    text: "What is the purpose of a cache?",
    options: [
      "To store data permanently",
      "To improve data access speed by storing frequently accessed data",
      "To compress data",
      "To encrypt data"
    ],
    correctAnswer: 1,
    explanation: "A cache stores frequently accessed data in a faster storage medium to reduce access time and improve performance.",
    difficulty: "Easy",
    category: "System Design",
    topic: "Caching",
    marks: 4
  },
  {
    text: "What is the time complexity of inserting an element at the beginning of a linked list?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n^2)"
    ],
    correctAnswer: 0,
    explanation: "Inserting an element at the beginning of a linked list takes constant time O(1) because you only need to update the head pointer and the new node's next pointer.",
    difficulty: "Easy",
    category: "Data Structures",
    topic: "Linked Lists",
    marks: 4
  }
];

// Function to find existing Microsoft quiz or create a new one
export const createOrUpdateMicrosoftQuiz = async () => {
  try {
    console.log('Looking for existing Microsoft Technical Interview Prep quiz...');
    
    // First, check if a quiz with this title already exists
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('title', '==', 'Microsoft Technical Interview Prep')
    );
    
    const querySnapshot = await getDocs(quizzesQuery);
    
    let quizId;
    
    if (!querySnapshot.empty) {
      // Quiz already exists, use the first one found
      const existingQuiz = querySnapshot.docs[0];
      quizId = existingQuiz.id;
      console.log(`Found existing Microsoft quiz with ID: ${quizId}`);
    } else {
      // Create a new quiz
      console.log('Creating new Microsoft Technical Interview Prep quiz...');
      
      const quizRef = doc(collection(db, 'quizzes'));
      const quizData = {
        ...microsoftQuiz,
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
      console.log(`Created new Microsoft quiz with ID: ${quizId}`);
    }
    
    // Clear existing questions (if any) and add new ones
    console.log('Adding Microsoft Technical Interview questions...');
    
    // Add questions to the quiz
    for (let i = 0; i < microsoftQuestions.length; i++) {
      const question = microsoftQuestions[i];
      
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
      questionCount: microsoftQuestions.length,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log(`Successfully created/updated Microsoft Technical Interview Prep quiz with ${microsoftQuestions.length} questions`);
    console.log(`Quiz ID: ${quizId}`);
    
    return quizId;
  } catch (error) {
    console.error('Error creating/updating Microsoft quiz:', error);
    throw error;
  }
};

export default { createOrUpdateMicrosoftQuiz };