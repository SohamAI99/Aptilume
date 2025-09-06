import React from 'react';
import QuestionCard from '../components/QuestionCard.jsx';

export default function ExamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Exam Interface</h1>
        <div className="grid grid-cols-1 gap-6">
          <QuestionCard 
            question={{ title: "Math Fundamentals", text: "What is 2 + 2?" }} 
            answer=""
          />
          <QuestionCard 
            question={{ title: "English Proficiency", text: "What does 'eloquent' mean?" }} 
            answer=""
          />
          <QuestionCard 
            question={{ title: "Programming Basics", text: "What is a JavaScript function?" }} 
            answer=""
          />
          <QuestionCard 
            question={{ title: "Data Structures", text: "Explain the difference between stacks and queues." }} 
            answer=""
          />
          <QuestionCard 
            question={{ title: "Web Development", text: "What is the purpose of HTTP status codes?" }} 
            answer=""
          />
          <QuestionCard 
            question={{ title: "Algebra", text: "Solve for x: 3x + 5 = 14" }} 
            answer=""
          />
        </div>
      </div>
    </div>
  );
}
