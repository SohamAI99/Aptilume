// Vercel API route for AI features
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
        // Get AI-generated content by ID or list all
        if (request.query.id) {
          const aiDoc = await db.collection('ai_content').doc(request.query.id).get();
          if (!aiDoc.exists) {
            return response.status(404).json({ error: 'AI content not found' });
          }
          return response.status(200).json({ id: aiDoc.id, ...aiDoc.data() });
        } else {
          const snapshot = await db.collection('ai_content').get();
          const aiContent = [];
          snapshot.forEach(doc => {
            aiContent.push({ id: doc.id, ...doc.data() });
          });
          return response.status(200).json(aiContent);
        }
        
      case 'POST':
        // Generate AI content
        const aiData = request.body;
        const aiRef = await db.collection('ai_content').add({
          ...aiData,
          createdAt: new Date(),
          status: 'pending'
        });
        return response.status(201).json({ id: aiRef.id, message: 'AI content generation requested' });
        
      case 'PUT':
        // Update AI content
        if (!request.query.id) {
          return response.status(400).json({ error: 'AI content ID is required' });
        }
        await db.collection('ai_content').doc(request.query.id).update({
          ...request.body,
          updatedAt: new Date()
        });
        return response.status(200).json({ message: 'AI content updated successfully' });
        
      case 'DELETE':
        // Delete AI content
        if (!request.query.id) {
          return response.status(400).json({ error: 'AI content ID is required' });
        }
        await db.collection('ai_content').doc(request.query.id).delete();
        return response.status(200).json({ message: 'AI content deleted successfully' });
        
      default:
        response.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return response.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: 'Internal server error', message: error.message });
  }
}