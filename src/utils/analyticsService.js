// Analytics Service - Handles all analytics calculations and data processing
import { db } from './firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore';

// Calculate user performance over time
export const getUserPerformanceData = async (userId, dateRange = '30d') => {
  try {
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Get user results within date range
    const resultsQuery = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      where('completedAt', '>=', startDate),
      orderBy('completedAt', 'desc')
    );
    
    const resultsSnapshot = await getDocs(resultsQuery);
    const results = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Group by date and calculate average score
    const performanceByDate = {};
    results.forEach(result => {
      const date = result.completedAt.toDate().toDateString();
      if (!performanceByDate[date]) {
        performanceByDate[date] = { scores: [], count: 0 };
      }
      performanceByDate[date].scores.push(result.score);
      performanceByDate[date].count++;
    });
    
    // Calculate average score for each date
    return Object.entries(performanceByDate).map(([date, data]) => {
      const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      return { date, score: Math.round(avgScore) };
    });
  } catch (error) {
    console.error('Error calculating user performance data:', error);
    throw error;
  }
};

// Calculate subject performance for a user
export const getUserSubjectPerformance = async (userId, dateRange = '30d') => {
  try {
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Get user results within date range
    const resultsQuery = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      where('completedAt', '>=', startDate),
      orderBy('completedAt', 'desc')
    );
    
    const resultsSnapshot = await getDocs(resultsQuery);
    const results = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Group by subject and calculate performance
    const subjectData = {};
    results.forEach(result => {
      // Try to get subject from quiz metadata or use quiz title
      const subject = result.quizSubject || result.quizTitle || 'Unknown Subject';
      if (!subjectData[subject]) {
        subjectData[subject] = { scores: [], tests: 0 };
      }
      subjectData[subject].scores.push(result.score);
      subjectData[subject].tests++;
    });
    
    // Calculate average score for each subject
    return Object.entries(subjectData).map(([subject, data]) => {
      const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      return { 
        subject, 
        score: Math.round(avgScore), 
        tests: data.tests 
      };
    });
  } catch (error) {
    console.error('Error calculating user subject performance:', error);
    throw error;
  }
};

// Calculate weekly progress for a user
export const getUserWeeklyProgress = async (userId, dateRange = '30d') => {
  try {
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Get user results within date range
    const resultsQuery = query(
      collection(db, 'results'),
      where('userId', '==', userId),
      where('completedAt', '>=', startDate),
      orderBy('completedAt', 'desc')
    );
    
    const resultsSnapshot = await getDocs(resultsQuery);
    const results = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Group by week and calculate progress
    const weeklyData = {};
    results.forEach(result => {
      const date = result.completedAt.toDate();
      // Calculate week number (1-4 for a month)
      const weekNumber = Math.ceil(date.getDate() / 7);
      const week = `Week ${weekNumber}`;
      if (!weeklyData[week]) {
        weeklyData[week] = { scores: [], completed: 0 };
      }
      weeklyData[week].scores.push(result.score);
      weeklyData[week].completed++;
    });
    
    // Calculate average score for each week
    return Object.entries(weeklyData).map(([week, data]) => {
      const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      return { 
        week, 
        completed: data.completed, 
        avgScore: Math.round(avgScore) 
      };
    });
  } catch (error) {
    console.error('Error calculating user weekly progress:', error);
    throw error;
  }
};

// Calculate teacher analytics (quizzes created, student performance, etc.)
export const getTeacherAnalytics = async (teacherId, dateRange = '30d') => {
  try {
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Get quizzes created by teacher
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('createdBy', '==', teacherId),
      where('createdAt', '>=', startDate),
      orderBy('createdAt', 'desc')
    );
    
    const quizzesSnapshot = await getDocs(quizzesQuery);
    const quizzes = quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Calculate quiz statistics
    const totalQuizzes = quizzes.length;
    const totalAttempts = quizzes.reduce((sum, quiz) => sum + (quiz.stats?.totalAttempts || 0), 0);
    const avgQuizScore = quizzes.length > 0 
      ? Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.stats?.averageScore || 0), 0) / quizzes.length)
      : 0;
      
    return {
      totalQuizzes,
      totalAttempts,
      avgQuizScore
    };
  } catch (error) {
    console.error('Error calculating teacher analytics:', error);
    throw error;
  }
};

// Calculate admin analytics (user registrations, system performance, etc.)
export const getAdminAnalytics = async (dateRange = '30d') => {
  try {
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Get user registrations within date range
    const usersQuery = query(
      collection(db, 'users'),
      where('createdAt', '>=', startDate),
      orderBy('createdAt', 'desc')
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Group by user type
    const userStats = {
      students: 0,
      teachers: 0,
      admins: 0
    };
    
    users.forEach(user => {
      switch (user.userType) {
        case 'student':
          userStats.students++;
          break;
        case 'teacher':
          userStats.teachers++;
          break;
        case 'admin':
          userStats.admins++;
          break;
      }
    });
    
    // Get quizzes created within date range
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('createdAt', '>=', startDate),
      orderBy('createdAt', 'desc')
    );
    
    const quizzesSnapshot = await getDocs(quizzesQuery);
    const quizzes = quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const totalQuizzes = quizzes.length;
    const publishedQuizzes = quizzes.filter(quiz => quiz.isPublished).length;
    
    return {
      userStats,
      totalQuizzes,
      publishedQuizzes
    };
  } catch (error) {
    console.error('Error calculating admin analytics:', error);
    throw error;
  }
};

// Calculate quiz performance analytics
export const getQuizPerformanceAnalytics = async (quizId) => {
  try {
    // Get quiz details
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (!quizDoc.exists()) {
      throw new Error('Quiz not found');
    }
    
    const quiz = { id: quizDoc.id, ...quizDoc.data() };
    
    // Get all attempts for this quiz
    const attemptsQuery = query(
      collection(db, 'attempts'),
      where('quizId', '==', quizId)
    );
    
    const attemptsSnapshot = await getDocs(attemptsQuery);
    const attempts = attemptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get all results for this quiz
    const resultsQuery = query(
      collection(db, 'results'),
      where('quizId', '==', quizId)
    );
    
    const resultsSnapshot = await getDocs(resultsQuery);
    const results = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
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
    console.error('Error calculating quiz performance analytics:', error);
    throw error;
  }
};

export default {
  getUserPerformanceData,
  getUserSubjectPerformance,
  getUserWeeklyProgress,
  getTeacherAnalytics,
  getAdminAnalytics,
  getQuizPerformanceAnalytics
};