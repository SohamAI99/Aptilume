// Utility to create a Microsoft Technical Interview Prep quiz
import { db, auth } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// Microsoft Technical Interview Prep quiz data
const microsoftQuiz = {
  title: "Microsoft Technical Interview Prep",
  description: "Prepare for Microsoft technical interviews with questions on data structures, algorithms, and system design.",
  difficulty: "Hard",
  duration: 90, // 90 minutes
  questionCount: 50, // Updated to 50 questions
  category: "Technical Interview",
  tags: ["microsoft", "technical-interview", "data-structures", "algorithms", "system-design"],
  isPublished: true,
  isRecommended: true
};

// Microsoft Technical Interview questions - expanded to 50 questions
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
  },
  // Additional 30 questions to reach 50 total
  {
    text: "What is the primary use of a semaphore in operating systems?",
    options: [
      "Memory management",
      "Process synchronization",
      "File handling",
      "Network communication"
    ],
    correctAnswer: 1,
    explanation: "Semaphores are synchronization primitives used to control access to shared resources in a concurrent environment.",
    difficulty: "Medium",
    category: "Operating Systems",
    topic: "Process Synchronization",
    marks: 4
  },
  {
    text: "Which data structure is most suitable for implementing a breadth-first search algorithm?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Graph"
    ],
    correctAnswer: 1,
    explanation: "BFS uses a queue to explore nodes level by level, following the FIFO (First In, First Out) principle.",
    difficulty: "Easy",
    category: "Algorithms",
    topic: "Graph Traversal",
    marks: 4
  },
  {
    text: "What is the time complexity of the merge operation in merge sort?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 2,
    explanation: "The merge operation combines two sorted arrays of size n/2, which takes linear time O(n).",
    difficulty: "Medium",
    category: "Algorithms",
    topic: "Sorting Algorithms",
    marks: 4
  },
  {
    text: "In a relational database, what is a foreign key?",
    options: [
      "A key that uniquely identifies each record in a table",
      "A key that references the primary key of another table",
      "A key used for encryption",
      "A key used for indexing"
    ],
    correctAnswer: 1,
    explanation: "A foreign key is a field in one table that refers to the primary key in another table, establishing a relationship between the tables.",
    difficulty: "Easy",
    category: "Databases",
    topic: "Relational Model",
    marks: 4
  },
  {
    text: "What is the purpose of normalization in database design?",
    options: [
      "To increase redundancy",
      "To reduce data redundancy and improve data integrity",
      "To speed up queries",
      "To compress data"
    ],
    correctAnswer: 1,
    explanation: "Normalization organizes data to minimize redundancy and dependency, improving data integrity and reducing storage requirements.",
    difficulty: "Medium",
    category: "Databases",
    topic: "Database Design",
    marks: 4
  },
  {
    text: "Which HTTP status code indicates that a resource was successfully created?",
    options: [
      "200 OK",
      "201 Created",
      "204 No Content",
      "301 Moved Permanently"
    ],
    correctAnswer: 1,
    explanation: "HTTP 201 Created status code indicates that the request has been fulfilled and a new resource has been created.",
    difficulty: "Easy",
    category: "Web Development",
    topic: "HTTP Status Codes",
    marks: 4
  },
  {
    text: "What is the main advantage of using a microservices architecture?",
    options: [
      "Simpler deployment",
      "Tighter coupling between components",
      "Independent deployment and scalability of services",
      "Reduced network overhead"
    ],
    correctAnswer: 2,
    explanation: "Microservices allow different services to be developed, deployed, and scaled independently, providing flexibility and resilience.",
    difficulty: "Medium",
    category: "System Design",
    topic: "Architecture Patterns",
    marks: 4
  },
  {
    text: "In object-oriented programming, what is polymorphism?",
    options: [
      "The ability to hide implementation details",
      "The ability to inherit properties from a parent class",
      "The ability of objects of different types to be treated as instances of the same type",
      "The ability to encapsulate data"
    ],
    correctAnswer: 2,
    explanation: "Polymorphism allows objects of different classes to be treated as instances of the same superclass through a common interface.",
    difficulty: "Medium",
    category: "Object-Oriented Programming",
    topic: "Polymorphism",
    marks: 4
  },
  {
    text: "What is the time complexity of finding the maximum element in a binary heap?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 0,
    explanation: "In a max-heap, the maximum element is always at the root, so it can be found in constant time O(1).",
    difficulty: "Medium",
    category: "Data Structures",
    topic: "Heaps",
    marks: 4
  },
  {
    text: "Which of the following is NOT a characteristic of a RESTful API?",
    options: [
      "Stateless",
      "Cacheable",
      "Uniform interface",
      "Session-based"
    ],
    correctAnswer: 3,
    explanation: "RESTful APIs are stateless, meaning each request from client to server must contain all the information needed to understand and process the request.",
    difficulty: "Medium",
    category: "Web Development",
    topic: "REST APIs",
    marks: 4
  },
  {
    text: "What is the primary purpose of a CDN (Content Delivery Network)?",
    options: [
      "To store user data",
      "To distribute content across multiple servers for faster delivery",
      "To encrypt data transmission",
      "To authenticate users"
    ],
    correctAnswer: 1,
    explanation: "A CDN distributes content across multiple geographically dispersed servers to reduce latency and improve load times for users.",
    difficulty: "Easy",
    category: "Networking",
    topic: "Content Delivery",
    marks: 4
  },
  {
    text: "In database transactions, what does the 'A' in ACID properties stand for?",
    options: [
      "Atomicity",
      "Availability",
      "Authentication",
      "Authorization"
    ],
    correctAnswer: 0,
    explanation: "Atomicity ensures that all operations within a transaction are completed successfully or none at all, maintaining data integrity.",
    difficulty: "Medium",
    category: "Databases",
    topic: "Transactions",
    marks: 4
  },
  {
    text: "What is the main advantage of using a trie data structure?",
    options: [
      "Memory efficiency",
      "Fast prefix-based searches",
      "Simplicity of implementation",
      "Balanced tree properties"
    ],
    correctAnswer: 1,
    explanation: "Tries are particularly efficient for prefix-based searches and autocomplete functionality, with O(m) time complexity where m is the length of the key.",
    difficulty: "Medium",
    category: "Data Structures",
    topic: "Trees",
    marks: 4
  },
  {
    text: "Which design pattern is used to ensure a class has only one instance?",
    options: [
      "Factory Pattern",
      "Observer Pattern",
      "Singleton Pattern",
      "Strategy Pattern"
    ],
    correctAnswer: 2,
    explanation: "The Singleton pattern restricts the instantiation of a class to one single instance and provides global access to that instance.",
    difficulty: "Easy",
    category: "Software Engineering",
    topic: "Design Patterns",
    marks: 4
  },
  {
    text: "What is the time complexity of building a heap from an unordered array?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 2,
    explanation: "Building a heap from an unordered array can be done in linear time O(n) using the bottom-up heap construction algorithm.",
    difficulty: "Hard",
    category: "Data Structures",
    topic: "Heaps",
    marks: 4
  },
  {
    text: "In CSS, what does the 'z-index' property control?",
    options: [
      "Horizontal positioning",
      "Vertical positioning",
      "Stacking order of elements",
      "Element size"
    ],
    correctAnswer: 2,
    explanation: "The z-index property controls the stacking order of positioned elements, determining which elements appear in front of others.",
    difficulty: "Easy",
    category: "Web Development",
    topic: "CSS",
    marks: 4
  },
  {
    text: "What is the primary purpose of a message queue in system design?",
    options: [
      "Data storage",
      "Asynchronous communication between services",
      "User authentication",
      "Load balancing"
    ],
    correctAnswer: 1,
    explanation: "Message queues enable asynchronous communication between services, decoupling components and improving system reliability.",
    difficulty: "Medium",
    category: "System Design",
    topic: "Messaging",
    marks: 4
  },
  {
    text: "Which algorithm is used for finding the shortest path in a weighted graph with negative edge weights?",
    options: [
      "Dijkstra's Algorithm",
      "Bellman-Ford Algorithm",
      "Floyd-Warshall Algorithm",
      "Prim's Algorithm"
    ],
    correctAnswer: 1,
    explanation: "Bellman-Ford algorithm can handle graphs with negative edge weights and detect negative cycles, unlike Dijkstra's algorithm.",
    difficulty: "Hard",
    category: "Algorithms",
    topic: "Graph Algorithms",
    marks: 4
  },
  {
    text: "What is the main difference between SQL and NoSQL databases?",
    options: [
      "SQL is faster than NoSQL",
      "SQL uses structured queries, NoSQL uses flexible data models",
      "SQL is open-source, NoSQL is proprietary",
      "SQL is for web apps, NoSQL is for mobile apps"
    ],
    correctAnswer: 1,
    explanation: "SQL databases use structured schemas and SQL for queries, while NoSQL databases use flexible data models like documents, key-value, or graphs.",
    difficulty: "Medium",
    category: "Databases",
    topic: "Database Types",
    marks: 4
  },
  {
    text: "In Git, what does the 'rebase' command do?",
    options: [
      "Deletes a branch",
      "Moves or combines a sequence of commits to a new base commit",
      "Creates a new repository",
      "Reverts changes"
    ],
    correctAnswer: 1,
    explanation: "Git rebase moves or combines a sequence of commits to a new base commit, maintaining a linear project history.",
    difficulty: "Medium",
    category: "Software Engineering",
    topic: "Version Control",
    marks: 4
  },
  {
    text: "What is the time complexity of the Knuth-Morris-Pratt string matching algorithm?",
    options: [
      "O(1)",
      "O(m + n)",
      "O(m * n)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation: "KMP algorithm has a time complexity of O(m + n) where m is the pattern length and n is the text length.",
    difficulty: "Hard",
    category: "Algorithms",
    topic: "String Algorithms",
    marks: 4
  },
  {
    text: "Which HTTP header is used for cache control?",
    options: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Accept"
    ],
    correctAnswer: 2,
    explanation: "The Cache-Control header is used to specify caching policies in both requests and responses.",
    difficulty: "Easy",
    category: "Web Development",
    topic: "HTTP Headers",
    marks: 4
  },
  {
    text: "What is the primary purpose of a circuit breaker pattern in microservices?",
    options: [
      "Load balancing",
      "Preventing cascading failures",
      "Data encryption",
      "User authentication"
    ],
    correctAnswer: 1,
    explanation: "The circuit breaker pattern prevents cascading failures by stopping requests to a failing service temporarily.",
    difficulty: "Medium",
    category: "System Design",
    topic: "Resilience Patterns",
    marks: 4
  },
  {
    text: "In machine learning, what is overfitting?",
    options: [
      "Using too little training data",
      "Model performs well on training data but poorly on new data",
      "Using too many features",
      "Slow training process"
    ],
    correctAnswer: 1,
    explanation: "Overfitting occurs when a model learns the training data too well, including noise and outliers, resulting in poor generalization.",
    difficulty: "Medium",
    category: "Technical Interview",
    topic: "Machine Learning",
    marks: 4
  },
  {
    text: "What is the time complexity of finding the median in a sorted array?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 0,
    explanation: "In a sorted array of size n, the median can be found in constant time O(1) by accessing the middle element(s).",
    difficulty: "Easy",
    category: "Algorithms",
    topic: "Searching",
    marks: 4
  },
  {
    text: "Which data structure is most appropriate for implementing an LRU (Least Recently Used) cache?",
    options: [
      "Array",
      "Hash Map + Doubly Linked List",
      "Stack",
      "Queue"
    ],
    correctAnswer: 1,
    explanation: "An LRU cache is typically implemented using a combination of a hash map for O(1) access and a doubly linked list for maintaining order.",
    difficulty: "Hard",
    category: "Data Structures",
    topic: "Caching",
    marks: 4
  },
  {
    text: "What is the main advantage of using Docker containers?",
    options: [
      "Better security",
      "Lightweight virtualization and consistent environments",
      "Faster internet connection",
      "Larger storage capacity"
    ],
    correctAnswer: 1,
    explanation: "Docker containers provide lightweight virtualization and ensure consistent environments across development, testing, and production.",
    difficulty: "Medium",
    category: "System Design",
    topic: "Containerization",
    marks: 4
  },
  {
    text: "In object-oriented programming, what is encapsulation?",
    options: [
      "Combining data and methods that operate on that data",
      "Creating new classes from existing classes",
      "Allowing objects of different types to be treated as the same type",
      "Hiding implementation details and restricting access to object components"
    ],
    correctAnswer: 3,
    explanation: "Encapsulation is the bundling of data with the methods that operate on that data and restricting direct access to object components.",
    difficulty: "Medium",
    category: "Object-Oriented Programming",
    topic: "Encapsulation",
    marks: 4
  },
  {
    text: "What is the time complexity of the Floyd-Warshall algorithm for finding all-pairs shortest paths?",
    options: [
      "O(V)",
      "O(E)",
      "O(V^2)",
      "O(V^3)"
    ],
    correctAnswer: 3,
    explanation: "Floyd-Warshall algorithm has a time complexity of O(V^3) where V is the number of vertices in the graph.",
    difficulty: "Hard",
    category: "Algorithms",
    topic: "Graph Algorithms",
    marks: 4
  },
  {
    text: "Which HTTP method should be used for updating a resource partially?",
    options: [
      "POST",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    correctAnswer: 2,
    explanation: "The PATCH method is used for partial updates to a resource, while PUT is typically used for complete replacement.",
    difficulty: "Easy",
    category: "Web Development",
    topic: "HTTP Methods",
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