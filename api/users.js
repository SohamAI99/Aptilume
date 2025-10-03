// Vercel API route for users
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
        // Get user by ID or list all users
        if (request.query.id) {
          const userDoc = await db.collection('users').doc(request.query.id).get();
          if (!userDoc.exists) {
            return response.status(404).json({ error: 'User not found' });
          }
          return response.status(200).json({ id: userDoc.id, ...userDoc.data() });
        } else {
          const snapshot = await db.collection('users').get();
          const users = [];
          snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
          });
          return response.status(200).json(users);
        }
        
      case 'POST':
        // Create user
        const userData = request.body;
        const userRef = await db.collection('users').add({
          ...userData,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          isActive: true,
          stats: {
            totalTestsTaken: 0,
            totalTestsCreated: 0,
            averageScore: 0,
            highestScore: 0,
            lastActive: new Date()
          }
        });
        return response.status(201).json({ id: userRef.id, message: 'User created successfully' });
        
      case 'PUT':
        // Update user
        if (!request.query.id) {
          return response.status(400).json({ error: 'User ID is required' });
        }
        await db.collection('users').doc(request.query.id).update({
          ...request.body,
          updatedAt: new Date()
        });
        return response.status(200).json({ message: 'User updated successfully' });
        
      case 'DELETE':
        // Delete user
        if (!request.query.id) {
          return response.status(400).json({ error: 'User ID is required' });
        }
        await db.collection('users').doc(request.query.id).delete();
        return response.status(200).json({ message: 'User deleted successfully' });
        
      default:
        response.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return response.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: 'Internal server error', message: error.message });
  }
}