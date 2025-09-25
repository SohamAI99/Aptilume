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

// Get attempt by ID
router.get('/:id', async (req, res) => {
  try {
    const attemptId = req.params.id;
    const attemptDoc = await db.collection('attempts').doc(attemptId).get();
    
    if (!attemptDoc.exists) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    
    res.json({ id: attemptDoc.id, ...attemptDoc.data() });
  } catch (error) {
    console.error('Error fetching attempt:', error);
    res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

// Create attempt
router.post('/', async (req, res) => {
  try {
    const attemptData = req.body;
    const attemptRef = await db.collection('attempts').add({
      ...attemptData,
      startedAt: new Date(),
      lastUpdatedAt: new Date(),
      status: 'in-progress'
    });
    
    res.status(201).json({ id: attemptRef.id, message: 'Attempt created successfully' });
  } catch (error) {
    console.error('Error creating attempt:', error);
    res.status(500).json({ error: 'Failed to create attempt' });
  }
});

// Update attempt
router.put('/:id', async (req, res) => {
  try {
    const attemptId = req.params.id;
    const attemptData = req.body;
    
    await db.collection('attempts').doc(attemptId).update({
      ...attemptData,
      lastUpdatedAt: new Date()
    });
    
    res.json({ message: 'Attempt updated successfully' });
  } catch (error) {
    console.error('Error updating attempt:', error);
    res.status(500).json({ error: 'Failed to update attempt' });
  }
});

// Get attempts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const snapshot = await db.collection('attempts')
      .where('userId', '==', userId)
      .orderBy('startedAt', 'desc')
      .limit(10)
      .get();
    
    const attempts = [];
    snapshot.forEach(doc => {
      attempts.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(attempts);
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({ error: 'Failed to fetch user attempts' });
  }
});

module.exports = router;