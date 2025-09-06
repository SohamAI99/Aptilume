const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Middleware to check if Firebase is initialized
const checkFirebase = (req, res, next) => {
  if (!db) {
    return res.status(503).json({ 
      error: 'Firebase service unavailable',
      message: 'Firebase Admin SDK not initialized' 
    });
  }
  next();
};

// Apply middleware to all routes
router.use(checkFirebase);

// Get result by ID
router.get('/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const resultDoc = await db.collection('results').doc(resultId).get();
    
    if (!resultDoc.exists) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    res.json({ id: resultDoc.id, ...resultDoc.data() });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// Create result
router.post('/', async (req, res) => {
  try {
    const resultData = req.body;
    const resultRef = await db.collection('results').add({
      ...resultData,
      createdAt: new Date()
    });
    
    res.status(201).json({ id: resultRef.id, message: 'Result created successfully' });
  } catch (error) {
    console.error('Error creating result:', error);
    res.status(500).json({ error: 'Failed to create result' });
  }
});

// Get results by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const snapshot = await db.collection('results')
      .where('userId', '==', userId)
      .orderBy('completedAt', 'desc')
      .limit(10)
      .get();
    
    const results = [];
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({ error: 'Failed to fetch user results' });
  }
});

module.exports = router;