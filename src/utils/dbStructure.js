// Firestore Database Structure Definition
// This file defines the complete database schema for the application

// 1. Users Collection
// Path: /users/{userId}
export const userStructure = {
  // Basic user information
  name: "string", // User's full name
  email: "string", // User's email address
  photoURL: "string", // URL to user's profile picture
  userType: "string", // 'student', 'teacher', 'admin'
  createdAt: "timestamp", // When the user account was created
  lastLoginAt: "timestamp", // When the user last logged in
  isActive: "boolean", // Whether the user account is active
  
  // Student-specific fields
  studentDetails: {
    dateOfBirth: "timestamp", // User's date of birth
    phone: "string", // User's phone number
    companyInterests: ["string"], // Companies the user is interested in
    skills: ["string"], // Skills the user has
    education: "string", // Education details
    experience: "string", // Work experience
  },
  
  // Teacher/Admin-specific fields
  teacherDetails: {
    department: "string", // Department if applicable
    specialization: "string", // Area of specialization
    yearsOfExperience: "number", // Years of teaching/industry experience
  },
  
  // Preferences
  preferences: {
    theme: "string", // 'light', 'dark'
    notifications: {
      email: "boolean", // Email notifications enabled
      push: "boolean", // Push notifications enabled
    },
  },
  
  // Stats
  stats: {
    totalTestsTaken: "number",
    totalTestsCreated: "number", // For teachers
    averageScore: "number",
    highestScore: "number",
    lastActive: "timestamp",
  }
};

// 2. Quizzes Collection
// Path: /quizzes/{quizId}
export const quizStructure = {
  title: "string", // Quiz title
  description: "string", // Quiz description
  duration: "number", // Duration in minutes
  difficulty: "string", // 'easy', 'medium', 'hard'
  companyTag: "string", // Company tag (e.g., 'Google', 'FAANG', 'MANGO')
  createdBy: "string", // User ID of creator
  createdAt: "timestamp", // When the quiz was created
  updatedAt: "timestamp", // When the quiz was last updated
  isPublished: "boolean", // Whether the quiz is published
  isRecommended: "boolean", // Whether the quiz is recommended
  rules: {
    numberOfQuestions: "number", // Total number of questions
    negativeMarking: "boolean", // Whether negative marking is enabled
    allowNavigation: "boolean", // Whether navigation between questions is allowed
    timeLimitPerQuestion: "number", // Time limit per question in seconds
  },
  metadata: {
    subject: "string", // Subject of the quiz
    category: "string", // Category (e.g., 'Technical', 'Behavioral')
    tags: ["string"], // Tags for filtering
    version: "string", // Quiz version
  },
  stats: {
    totalAttempts: "number", // Total number of attempts
    averageScore: "number", // Average score
    highestScore: "number", // Highest score achieved
  }
};

// 3. Questions Subcollection
// Path: /quizzes/{quizId}/questions/{questionId}
export const questionStructure = {
  type: "string", // 'mcq', 'coding', 'subjective'
  question: "string", // The question text
  options: ["string"], // Options for MCQ (if applicable)
  correctAnswer: "string", // Correct answer (could be index for MCQ)
  explanation: "string", // Explanation for the answer
  difficulty: "string", // 'easy', 'medium', 'hard'
  topic: "string", // Topic this question covers
  marks: "number", // Marks for this question
  timeLimit: "number", // Time limit for this question in seconds
  createdAt: "timestamp", // When the question was created
  createdBy: "string", // User ID of creator
  isAIgenerated: "boolean", // Whether this question was AI-generated
  aiModel: "string", // Which AI model generated this question (if applicable)
};

// 4. Results Collection
// Path: /results/{resultId}
export const resultStructure = {
  userId: "string", // User ID
  quizId: "string", // Quiz ID
  attemptId: "string", // Attempt ID (link to attempts collection)
  score: "number", // Overall score
  correctAnswers: "number", // Number of correct answers
  totalQuestions: "number", // Total number of questions
  timeTaken: "number", // Time taken in seconds
  startedAt: "timestamp", // When the attempt started
  completedAt: "timestamp", // When the attempt completed
  answers: [
    {
      questionId: "string", // Question ID
      selectedAnswer: "string", // User's answer
      isCorrect: "boolean", // Whether the answer was correct
      timeTaken: "number", // Time taken for this question in seconds
    }
  ],
  analytics: {
    accuracyByTopic: {
      // topic: accuracyPercentage
    },
    timeDistribution: {
      // topic: timeSpent
    },
    difficultyPerformance: {
      easy: "number", // Percentage correct for easy questions
      medium: "number", // Percentage correct for medium questions
      hard: "number", // Percentage correct for hard questions
    }
  },
  aiInsights: {
    strengths: ["string"], // Topics where user performed well
    weaknesses: ["string"], // Topics where user needs improvement
    recommendations: ["string"], // Recommended next steps
    difficultyProgression: "string", // Recommended difficulty level for next quiz
  }
};

// 5. Attempts Collection
// Path: /attempts/{attemptId}
export const attemptStructure = {
  userId: "string", // User ID
  quizId: "string", // Quiz ID
  status: "string", // 'in-progress', 'completed', 'paused'
  startedAt: "timestamp", // When the attempt started
  lastUpdatedAt: "timestamp", // When the attempt was last updated
  completedAt: "timestamp", // When the attempt was completed
  currentQuestionIndex: "number", // Current question index (for resuming)
  answers: {
    // questionId: userAnswer
  },
  timeSpent: "number", // Total time spent in seconds
  isProctored: "boolean", // Whether this attempt is proctored
};

// 6. Activity Logs Collection
// Path: /activity_logs/{logId}
export const activityLogStructure = {
  userId: "string", // User ID (optional)
  type: "string", // 'user', 'system', 'admin'
  action: "string", // Action performed
  details: "string", // Additional details
  timestamp: "timestamp", // When the action occurred
  ipAddress: "string", // IP address (optional)
  userAgent: "string", // User agent (optional)
};

// 7. AI Generated Content Collection
// Path: /ai_content/{contentId}
export const aiContentStructure = {
  type: "string", // 'quiz', 'questions', 'interview'
  prompt: "string", // The prompt used to generate content
  generatedContent: "object", // The generated content
  userId: "string", // User ID who requested generation
  createdAt: "timestamp", // When the content was generated
  aiModel: "string", // Which AI model was used
  processingTime: "number", // Time taken to generate in milliseconds
  cost: "number", // Estimated cost of generation (if applicable)
};

// 8. Notifications Collection
// Path: /notifications/{notificationId}
export const notificationStructure = {
  userId: "string", // User ID (recipient)
  type: "string", // 'info', 'warning', 'success', 'error'
  title: "string", // Notification title
  message: "string", // Notification message
  isRead: "boolean", // Whether the notification has been read
  createdAt: "timestamp", // When the notification was created
  actionUrl: "string", // URL to navigate to when clicked (optional)
};

export default {
  userStructure,
  quizStructure,
  questionStructure,
  resultStructure,
  attemptStructure,
  activityLogStructure,
  aiContentStructure,
  notificationStructure
};