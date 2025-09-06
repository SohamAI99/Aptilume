import { seedQuizzes } from './src/utils/quizSeeder.js';

// Run the seeder
seedQuizzes().then(() => {
  console.log('Quiz seeding completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('Error seeding quizzes:', error);
  process.exit(1);
});