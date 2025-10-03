// Vercel API route for results
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
        // Get result by ID or list all results
        if (request.query.id) {
          const resultDoc = await db.collection('results').doc(request.query.id).get();
          if (!resultDoc.exists) {
            return response.status(404).json({ error: 'Result not found' });
          }
          return response.status(200).json({ id: resultDoc.id, ...resultDoc.data() });
        } else {
          const snapshot = await db.collection('results').get();
          const results = [];
          snapshot.forEach(doc => {
            results.push({ id: doc.id, ...doc.data() });
          });
          return response.status(200).json(results);
        }
        
      case 'POST':
        // Create result
        const resultData = request.body;
        const resultRef = await db.collection('results').add({
          ...resultData,
          createdAt: new Date()
        });
        return response.status(201).json({ id: resultRef.id, message: 'Result created successfully' });
        
      case 'PUT':
        // Update result
        if (!request.query.id) {
          return response.status(400).json({ error: 'Result ID is required' });
        }
        await db.collection('results').doc(request.query.id).update({
          ...request.body,
          updatedAt: new Date()
        });
        return response.status(200).json({ message: 'Result updated successfully' });
        
      case 'DELETE':
        // Delete result
        if (!request.query.id) {
          return response.status(400).json({ error: 'Result ID is required' });
        }
        await db.collection('results').doc(request.query.id).delete();
        return response.status(200).json({ message: 'Result deleted successfully' });
        
      default:
        response.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return response.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: 'Internal server error', message: error.message });
  }
}