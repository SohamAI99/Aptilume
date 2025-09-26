// Simple script to seed only the aptitude quiz
import { seedAptitudeQuizOnly } from '../src/utils/seed.js';

async function seedAptitude() {
  try {
    console.log('Seeding Aptitude Test quiz...');
    await seedAptitudeQuizOnly();
    console.log('Aptitude Test quiz successfully seeded!');
  } catch (error) {
    console.error('Error seeding Aptitude Test quiz:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAptitude();