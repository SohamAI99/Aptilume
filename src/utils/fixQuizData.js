// Utility to fix quiz data in Firebase
import { db } from './firebase.js';
import { doc, getDoc, getDocs, collection, setDoc, updateDoc } from 'firebase/firestore';

export const fixQuizData = async (quizId) => {
  try {
    console.log('Fixing quiz data for ID:', quizId);
    
    // Get quiz document
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (!quizDoc.exists()) {
      throw new Error('Quiz not found with ID: ' + quizId);
    }
    
    const quizData = quizDoc.data();
    console.log('Original quiz data:', quizData);
    
    // Fix quiz data if needed
    const fixedQuizData = {
      ...quizData,
      title: quizData.title || 'Untitled Quiz',
      duration: quizData.duration || 60,
      questionCount: quizData.questionCount || 0,
      isPublished: quizData.isPublished !== undefined ? quizData.isPublished : true,
      isRecommended: quizData.isRecommended !== undefined ? quizData.isRecommended : false
    };
    
    // Update quiz document if changes were made
    if (JSON.stringify(quizData) !== JSON.stringify(fixedQuizData)) {
      await updateDoc(doc(db, 'quizzes', quizId), fixedQuizData);
      console.log('Fixed quiz data:', fixedQuizData);
    }
    
    // Get questions subcollection
    console.log('Fetching questions for quiz:', quizId);
    
    const questionsSnapshot = await getDocs(collection(db, 'quizzes', quizId, 'questions'));
    console.log('Questions snapshot size:', questionsSnapshot.size);
    
    let fixedQuestionsCount = 0;
    
    for (const docSnapshot of questionsSnapshot.docs) {
      const questionData = docSnapshot.data();
      console.log('Processing question:', docSnapshot.id);
      
      // Fix question data if needed
      let fixedQuestionData = { ...questionData };
      let needsUpdate = false;
      
      // Ensure we have text
      if (!fixedQuestionData.text && fixedQuestionData.question) {
        fixedQuestionData.text = fixedQuestionData.question;
        delete fixedQuestionData.question;
        needsUpdate = true;
      } else if (!fixedQuestionData.text) {
        fixedQuestionData.text = 'Untitled question';
        needsUpdate = true;
      }
      
      // Ensure we have options as array
      if (!Array.isArray(fixedQuestionData.options)) {
        if (typeof fixedQuestionData.options === 'object' && fixedQuestionData.options !== null) {
          fixedQuestionData.options = Object.values(fixedQuestionData.options);
          needsUpdate = true;
        } else {
          fixedQuestionData.options = ['Option A', 'Option B', 'Option C', 'Option D'];
          needsUpdate = true;
        }
      }
      
      // Ensure we have at least 4 options
      if (fixedQuestionData.options.length < 4) {
        while (fixedQuestionData.options.length < 4) {
          fixedQuestionData.options.push(`Option ${String.fromCharCode(65 + fixedQuestionData.options.length)}`);
        }
        needsUpdate = true;
      }
      
      // Ensure we don't have more than 4 options
      if (fixedQuestionData.options.length > 4) {
        fixedQuestionData.options = fixedQuestionData.options.slice(0, 4);
        needsUpdate = true;
      }
      
      // Ensure we have a correct answer
      if (fixedQuestionData.correctAnswer === undefined) {
        fixedQuestionData.correctAnswer = 0;
        needsUpdate = true;
      }
      
      // Ensure we have an explanation
      if (!fixedQuestionData.explanation) {
        fixedQuestionData.explanation = 'No explanation provided';
        needsUpdate = true;
      }
      
      // Ensure we have difficulty
      if (!fixedQuestionData.difficulty) {
        fixedQuestionData.difficulty = 'Medium';
        needsUpdate = true;
      }
      
      // Ensure we have category
      if (!fixedQuestionData.category && fixedQuestionData.topic) {
        fixedQuestionData.category = fixedQuestionData.topic;
        delete fixedQuestionData.topic;
        needsUpdate = true;
      } else if (!fixedQuestionData.category) {
        fixedQuestionData.category = 'General';
        needsUpdate = true;
      }
      
      // Ensure we have marks
      if (!fixedQuestionData.marks) {
        fixedQuestionData.marks = 4;
        needsUpdate = true;
      }
      
      // Update question if changes were made
      if (needsUpdate) {
        await setDoc(doc(db, 'quizzes', quizId, 'questions', docSnapshot.id), fixedQuestionData, { merge: true });
        console.log('Fixed question:', docSnapshot.id);
        fixedQuestionsCount++;
      }
    }
    
    // Update question count in quiz
    const finalQuestionsCount = questionsSnapshot.size;
    if (fixedQuizData.questionCount !== finalQuestionsCount) {
      await updateDoc(doc(db, 'quizzes', quizId), { questionCount: finalQuestionsCount });
      console.log('Updated question count to:', finalQuestionsCount);
    }
    
    console.log('Fixed quiz data successfully');
    return {
      success: true,
      quizId,
      fixedQuestions: fixedQuestionsCount,
      totalQuestions: finalQuestionsCount
    };
  } catch (error) {
    console.error('Error fixing quiz data:', error);
    throw error;
  }
};

export default { fixQuizData };