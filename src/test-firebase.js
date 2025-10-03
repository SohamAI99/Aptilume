// Simple Firebase test component
import React, { useEffect, useState } from 'react';
import { db } from './utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

const TestFirebase = () => {
  const [status, setStatus] = useState('Checking Firebase connection...');
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('Testing Firebase connection...');
        
        // Test if db is initialized
        if (!db) {
          setStatus('Firebase not initialized');
          return;
        }
        
        setStatus('Firebase connected, fetching quizzes...');
        
        // Try to fetch some data
        const querySnapshot = await getDocs(collection(db, 'quizzes'));
        const quizList = [];
        querySnapshot.forEach((doc) => {
          quizList.push({ id: doc.id, ...doc.data() });
        });
        
        setQuizzes(quizList);
        setStatus(`Firebase working! Found ${quizList.length} quizzes.`);
      } catch (error) {
        console.error('Firebase test error:', error);
        setStatus(`Firebase error: ${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Firebase Test</h1>
      <p>Status: {status}</p>
      {quizzes.length > 0 && (
        <div>
          <h2>Quizzes Found:</h2>
          <ul>
            {quizzes.map(quiz => (
              <li key={quiz.id}>{quiz.title || 'Untitled Quiz'}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestFirebase;