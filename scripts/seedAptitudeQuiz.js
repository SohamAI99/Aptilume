// Script to seed the aptitude quiz
import { createOrUpdateAptitudeQuiz } from '../src/utils/createAptitudeQuiz.js';

async function seedAptitudeQuiz() {
  try {
    console.log('Seeding Aptitude Test quiz...');
    const quizId = await createOrUpdateAptitudeQuiz();
    console.log(`Aptitude Test quiz successfully seeded with ID: ${quizId}`);
  } catch (error) {
    console.error('Error seeding Aptitude Test quiz:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAptitudeQuiz();