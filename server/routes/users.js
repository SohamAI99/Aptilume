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

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
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
    
    res.status(201).json({ id: userRef.id, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    
    await db.collection('users').doc(userId).update({
      ...userData,
      updatedAt: new Date()
    });
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;