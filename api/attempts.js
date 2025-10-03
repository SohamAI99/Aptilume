// Vercel API route for attempts
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
        // Get attempt by ID or list all attempts
        if (request.query.id) {
          const attemptDoc = await db.collection('attempts').doc(request.query.id).get();
          if (!attemptDoc.exists) {
            return response.status(404).json({ error: 'Attempt not found' });
          }
          return response.status(200).json({ id: attemptDoc.id, ...attemptDoc.data() });
        } else {
          const snapshot = await db.collection('attempts').get();
          const attempts = [];
          snapshot.forEach(doc => {
            attempts.push({ id: doc.id, ...doc.data() });
          });
          return response.status(200).json(attempts);
        }
        
      case 'POST':
        // Create attempt
        const attemptData = request.body;
        const attemptRef = await db.collection('attempts').add({
          ...attemptData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return response.status(201).json({ id: attemptRef.id, message: 'Attempt created successfully' });
        
      case 'PUT':
        // Update attempt
        if (!request.query.id) {
          return response.status(400).json({ error: 'Attempt ID is required' });
        }
        await db.collection('attempts').doc(request.query.id).update({
          ...request.body,
          updatedAt: new Date()
        });
        return response.status(200).json({ message: 'Attempt updated successfully' });
        
      case 'DELETE':
        // Delete attempt
        if (!request.query.id) {
          return response.status(400).json({ error: 'Attempt ID is required' });
        }
        await db.collection('attempts').doc(request.query.id).delete();
        return response.status(200).json({ message: 'Attempt deleted successfully' });
        
      default:
        response.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return response.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: 'Internal server error', message: error.message });
  }
}