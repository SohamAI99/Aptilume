import React from 'react';
import AppIcon from '../../../components/AppIcon.jsx';

export default function QuestionCard({ question, answer }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{question.title}</h3>
        <AppIcon name="check" className="w-6 h-6 text-green-600" />
      </div>
      <p className="text-gray-700 mb-4">{question.text}</p>
      <div className="border-t pt-4">
        <label className="block text-gray-700 mb-2" htmlFor="answer">
          Your Answer:
        </label>
        <textarea 
          id="answer" 
          className="w-full p-3 border rounded text-gray-800" 
          rows="3"
          defaultValue={answer}
        ></textarea>
      </div>
    </div>
  );
}
