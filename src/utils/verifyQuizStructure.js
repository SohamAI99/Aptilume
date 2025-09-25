// Utility to verify quiz structure in Firebase
import { db } from './firebase.js';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

export const verifyQuizStructure = async (quizId) => {
  try {
    console.log('Verifying quiz structure for ID:', quizId);
    
    // Get quiz document
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (!quizDoc.exists()) {
      console.error('Quiz not found with ID:', quizId);
      return { valid: false, error: 'Quiz not found' };
    }
    
    const quizData = quizDoc.data();
    console.log('Quiz data:', quizData);
    
    // Check required quiz fields
    const requiredQuizFields = ['title', 'duration', 'questionCount'];
    const missingQuizFields = requiredQuizFields.filter(field => !quizData[field]);
    
    if (missingQuizFields.length > 0) {
      console.warn('Missing quiz fields:', missingQuizFields);
    }
    
    // Get questions subcollection
    console.log('Fetching questions for quiz:', quizId);
    
    let questionsQuery;
    try {
      questionsQuery = query(
        collection(db, 'quizzes', quizId, 'questions'),
        orderBy('createdAt', 'asc')
      );
    } catch (orderError) {
      console.log('Ordering failed, trying without ordering');
      questionsQuery = collection(db, 'quizzes', quizId, 'questions');
    }
    
    const questionsSnapshot = await getDocs(questionsQuery);
    console.log('Questions snapshot size:', questionsSnapshot.size);
    
    if (questionsSnapshot.empty) {
      return { valid: false, error: 'No questions found in quiz' };
    }
    
    const questions = [];
    let validQuestions = 0;
    let invalidQuestions = 0;
    
    questionsSnapshot.forEach((doc) => {
      const questionData = doc.data();
      console.log('Question document ID:', doc.id);
      console.log('Question data:', questionData);
      
      // Check required question fields
      const requiredQuestionFields = ['text', 'options', 'correctAnswer'];
      const missingQuestionFields = requiredQuestionFields.filter(field => {
        if (field === 'text') {
          return !questionData.text && !questionData.question;
        }
        return !questionData[field];
      });
      
      const isValid = missingQuestionFields.length === 0 && 
                     Array.isArray(questionData.options) && 
                     questionData.options.length >= 2;
      
      if (isValid) {
        validQuestions++;
      } else {
        invalidQuestions++;
        console.warn('Invalid question:', doc.id, 'Missing fields:', missingQuestionFields);
      }
      
      questions.push({
        id: doc.id,
        valid: isValid,
        missingFields: missingQuestionFields,
        ...questionData
      });
    });
    
    const isValid = validQuestions > 0 && invalidQuestions === 0;
    
    console.log('Verification results:', {
      totalQuestions: questions.length,
      validQuestions,
      invalidQuestions,
      isValid
    });
    
    return {
      valid: isValid,
      quiz: {
        id: quizDoc.id,
        ...quizData
      },
      questions: questions,
      summary: {
        totalQuestions: questions.length,
        validQuestions,
        invalidQuestions
      }
    };
  } catch (error) {
    console.error('Error verifying quiz structure:', error);
    return { valid: false, error: error.message };
  }
};

export default { verifyQuizStructure };