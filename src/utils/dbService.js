// Database Service - Handles all Firestore operations
import { db, auth } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

// User Operations
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const createUserProfile = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isActive: true,
      stats: {
        totalTestsTaken: 0,
        totalTestsCreated: 0,
        averageScore: 0,
        highestScore: 0,
        lastActive: serverTimestamp()
      }
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Quiz Operations
export const getQuiz = async (quizId) => {
  try {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    return quizDoc.exists() ? { id: quizDoc.id, ...quizDoc.data() } : null;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

export const getQuizzes = async (filters = {}, limitCount = 10) => {
  try {
    let q = query(collection(db, 'quizzes'), limit(limitCount));
    
    // Apply filters if provided
    if (filters.companyTag) {
      q = query(q, where('companyTag', '==', filters.companyTag));
    }
    
    if (filters.difficulty) {
      q = query(q, where('difficulty', '==', filters.difficulty));
    }
    
    if (filters.isPublished !== undefined) {
      q = query(q, where('isPublished', '==', filters.isPublished));
    }
    
    if (filters.isRecommended !== undefined) {
      q = query(q, where('isRecommended', '==', filters.isRecommended));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

export const createQuiz = async (quizData) => {
  try {
    const quizRef = doc(collection(db, 'quizzes'));
    await setDoc(quizRef, {
      ...quizData,
      createdBy: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPublished: false,
      stats: {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0
      }
    });
    return quizRef.id;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const updateQuiz = async (quizId, data) => {
  try {
    await updateDoc(doc(db, 'quizzes', quizId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

// Question Operations
export const getQuestions = async (quizId) => {
  try {
    const q = query(
      collection(db, 'quizzes', quizId, 'questions'),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const addQuestion = async (quizId, questionData) => {
  try {
    const questionRef = doc(collection(db, 'quizzes', quizId, 'questions'));
    await setDoc(questionRef, {
      ...questionData,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser?.uid
    });
    return questionRef.id;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

export const updateQuestion = async (quizId, questionId, data) => {
  try {
    await updateDoc(doc(db, 'quizzes', quizId, 'questions', questionId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (quizId, questionId) => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId, 'questions', questionId));
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// Attempt Operations
export const getAttempt = async (attemptId) => {
  try {
    const attemptDoc = await getDoc(doc(db, 'attempts', attemptId));
    return attemptDoc.exists() ? { id: attemptDoc.id, ...attemptDoc.data() } : null;
  } catch (error) {
    console.error('Error fetching attempt:', error);
    throw error;
  }
};

export const createAttempt = async (attemptData) => {
  try {
    const attemptRef = doc(collection(db, 'attempts'));
    await setDoc(attemptRef, {
      ...attemptData,
      userId: auth.currentUser?.uid,
      startedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
      status: 'in-progress'
    });
    return attemptRef.id;
  } catch (error) {
    console.error('Error creating attempt:', error);
    throw error;
  }
};

export const updateAttempt = async (attemptId, data) => {
  try {
    await updateDoc(doc(db, 'attempts', attemptId), {
      ...data,
      lastUpdatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating attempt:', error);
    throw error;
  }
};

export const getAttemptsByUser = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'attempts'),
      where('userId', '==', userId),
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    throw error;
  }
};

export const getAttemptsByQuiz = async (quizId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'attempts'),
      where('quizId', '==', quizId),
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    throw error;
  }
};

// Result Operations
export const getResult = async (resultId) => {
  try {
    const resultDoc = await getDoc(doc(db, 'results', resultId));
    return resultDoc.exists() ? { id: resultDoc.id, ...resultDoc.data() } : null;
  } catch (error) {
    console.error('Error fetching result:', error);
    throw error;
  }
};

export const createResult = async (resultData) => {
  try {
    const resultRef = doc(collection(db, 'results'));
    await setDoc(resultRef, {
      ...resultData,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp()
    });
    return resultRef.id;
  } catch (error) {
    console.error('Error creating result:', error);
    throw error;
  }
};

export const getResultsByUser = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user results:', error);
    throw error;
  }
};

export const getResultsByQuiz = async (quizId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'results'),
      where('quizId', '==', quizId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    throw error;
  }
};

// Real-time Listeners
export const listenToUser = (userId, callback) => {
  return onSnapshot(doc(db, 'users', userId), (doc) => {
    callback(doc.exists() ? { id: doc.id, ...doc.data() } : null);
  });
};

export const listenToUsers = (callback) => {
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (querySnapshot) => {
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  });
};

// Optimized listener for leaderboard - only active students with attempts
export const listenToLeaderboardUsers = (callback) => {
  const q = query(
    collection(db, 'users'),
    where('userType', '==', 'student'),
    where('isActive', '==', true)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter users who have taken at least one test
    const validUsers = users.filter(user => 
      user.stats && user.stats.totalTestsTaken > 0
    );
    callback(validUsers);
  });
};

export const listenToQuiz = (quizId, callback) => {
  return onSnapshot(doc(db, 'quizzes', quizId), (doc) => {
    callback(doc.exists() ? { id: doc.id, ...doc.data() } : null);
  });
};

export const listenToQuizzes = (callback, filters = {}) => {
  let q = query(collection(db, 'quizzes'));
  
  if (filters.companyTag) {
    q = query(q, where('companyTag', '==', filters.companyTag));
  }
  
  if (filters.difficulty) {
    q = query(q, where('difficulty', '==', filters.difficulty));
  }
  
  if (filters.isPublished !== undefined) {
    q = query(q, where('isPublished', '==', filters.isPublished));
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const quizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(quizzes);
  });
};

export const listenToResultsByQuiz = (quizId, callback) => {
  const q = query(
    collection(db, 'results'),
    where('quizId', '==', quizId),
    orderBy('completedAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(results);
  });
};

// User Management Functions
export const activateUser = async (userId) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      isActive: true,
      status: 'active',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      isActive: false,
      status: 'inactive',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
};

export const suspendUser = async (userId) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      isActive: false,
      status: 'suspended',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    throw error;
  }
};

// Quiz Management Functions
export const publishQuiz = async (quizId) => {
  try {
    await updateDoc(doc(db, 'quizzes', quizId), {
      isPublished: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error publishing quiz:', error);
    throw error;
  }
};

export const archiveQuiz = async (quizId) => {
  try {
    await updateDoc(doc(db, 'quizzes', quizId), {
      isPublished: false,
      status: 'archived',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error archiving quiz:', error);
    throw error;
  }
};

// Analytics Functions
export const getQuizPerformance = async (quizId) => {
  try {
    // Get quiz details
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (!quizDoc.exists()) {
      throw new Error('Quiz not found');
    }
    
    const quiz = { id: quizDoc.id, ...quizDoc.data() };
    
    // Get all attempts for this quiz
    const attempts = await getAttemptsByQuiz(quizId, 100);
    
    // Get all results for this quiz
    const results = await getResultsByQuiz(quizId, 100);
    
    // Calculate performance metrics
    const totalAttempts = attempts.length;
    const completedAttempts = results.length;
    const completionRate = totalAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 100) : 0;
    
    const avgScore = results.length > 0 
      ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
      : 0;
      
    const highestScore = results.length > 0 
      ? Math.max(...results.map(result => result.score))
      : 0;
      
    const lowestScore = results.length > 0 
      ? Math.min(...results.map(result => result.score))
      : 0;
    
    return {
      quiz,
      totalAttempts,
      completedAttempts,
      completionRate,
      avgScore,
      highestScore,
      lowestScore,
      results
    };
  } catch (error) {
    console.error('Error calculating quiz performance:', error);
    throw error;
  }
};

export default {
  getUser,
  getUsers,
  updateUser,
  createUserProfile,
  getQuiz,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAttempt,
  createAttempt,
  updateAttempt,
  getAttemptsByUser,
  getAttemptsByQuiz,
  getResult,
  createResult,
  getResultsByUser,
  getResultsByQuiz,
  listenToUser,
  listenToUsers,
  listenToLeaderboardUsers,
  listenToQuiz,
  listenToQuizzes,
  listenToResultsByQuiz,
  activateUser,
  deactivateUser,
  suspendUser,
  publishQuiz,
  archiveQuiz,
  getQuizPerformance
};