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

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    
    if (!quizDoc.exists) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.json({ id: quizDoc.id, ...quizDoc.data() });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Get all quizzes with optional filters
router.get('/', async (req, res) => {
  try {
    let query = db.collection('quizzes');
    
    // Apply filters if provided
    if (req.query.companyTag) {
      query = query.where('companyTag', '==', req.query.companyTag);
    }
    
    if (req.query.difficulty) {
      query = query.where('difficulty', '==', req.query.difficulty);
    }
    
    if (req.query.isPublished !== undefined) {
      query = query.where('isPublished', '==', req.query.isPublished === 'true');
    }
    
    const snapshot = await query.get();
    const quizzes = [];
    snapshot.forEach(doc => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Create quiz
router.post('/', async (req, res) => {
  try {
    const quizData = req.body;
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
    
    res.status(201).json({ id: quizRef.id, message: 'Quiz created successfully' });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Update quiz
router.put('/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const quizData = req.body;
    
    await db.collection('quizzes').doc(quizId).update({
      ...quizData,
      updatedAt: new Date()
    });
    
    res.json({ message: 'Quiz updated successfully' });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete quiz
router.delete('/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    await db.collection('quizzes').doc(quizId).delete();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

module.exports = router;