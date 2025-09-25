// Simple script to create Microsoft Technical Interview Prep quiz
import { createOrUpdateMicrosoftQuiz } from './src/utils/createMicrosoftQuiz.js';

// Run the function
createOrUpdateMicrosoftQuiz()
  .then(quizId => {
    console.log(`Microsoft Technical Interview Prep quiz created/updated successfully with ID: ${quizId}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error creating/updating Microsoft quiz:', error);
    process.exit(1);
  });