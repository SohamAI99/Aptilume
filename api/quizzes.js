// Vercel API route for quizzes
import { db } from '../server/config/firebase';

export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }
  
  try {
    if (!db) {
      return response.status(503).json({ 
        error: 'Firebase service unavailable',
        message: 'Firebase Admin SDK not initialized' 
      });
    }
    
    const { method } = request;
    
    switch (method) {
      case 'GET':
        // Get quiz by ID or list all quizzes
        if (request.query.id) {
          const quizDoc = await db.collection('quizzes').doc(request.query.id).get();
          if (!quizDoc.exists) {
            return response.status(404).json({ error: 'Quiz not found' });
          }
          return response.status(200).json({ id: quizDoc.id, ...quizDoc.data() });
        } else {
          let query = db.collection('quizzes');
          
          // Apply filters if provided
          if (request.query.companyTag) {
            query = query.where('companyTag', '==', request.query.companyTag);
          }
          
          if (request.query.difficulty) {
            query = query.where('difficulty', '==', request.query.difficulty);
          }
          
          if (request.query.isPublished !== undefined) {
            query = query.where('isPublished', '==', request.query.isPublished === 'true');
          }
          
          const snapshot = await query.get();
          const quizzes = [];
          snapshot.forEach(doc => {
            quizzes.push({ id: doc.id, ...doc.data() });
          });
          return response.status(200).json(quizzes);
        }
        
      case 'POST':
        // Create quiz
        const quizData = request.body;
        const quizRef = await db.collection('quizzes').add({
          ...quizData,
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublished: false,
          stats: {
            totalAttempts: 0,
            averageScore: 0,
            highestScore: 0
          }
        });
        return response.status(201).json({ id: quizRef.id, message: 'Quiz created successfully' });
        
      case 'PUT':
        // Update quiz
        if (!request.query.id) {
          return response.status(400).json({ error: 'Quiz ID is required' });
        }
        await db.collection('quizzes').doc(request.query.id).update({
          ...request.body,
          updatedAt: new Date()
        });
        return response.status(200).json({ message: 'Quiz updated successfully' });
        
      case 'DELETE':
        // Delete quiz
        if (!request.query.id) {
          return response.status(400).json({ error: 'Quiz ID is required' });
        }
        await db.collection('quizzes').doc(request.query.id).delete();
        return response.status(200).json({ message: 'Quiz deleted successfully' });
        
      default:
        response.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return response.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: 'Internal server error', message: error.message });
  }
}