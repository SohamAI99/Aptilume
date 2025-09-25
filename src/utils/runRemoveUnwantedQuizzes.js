// Script to run the removal of unwanted quizzes
import { removeUnwantedQuizzes } from './removeUnwantedQuizzes.js';

async function run() {
  try {
    console.log('Starting removal of unwanted quizzes...');
    const result = await removeUnwantedQuizzes();
    console.log('Removal completed:', result);
  } catch (error) {
    console.error('Error during quiz removal:', error);
  }
}

// Run the script
run();