import React from 'react';
import AppIcon from '../../../components/AppIcon.jsx';

export default function QuickStatsWidget() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-blue-600 font-medium">Total Attempts</h3>
          <p className="text-3xl font-bold text-blue-800">12</p>
          <AppIcon name="stats" className="w-12 h-12 mt-2 text-blue-600" />
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-green-600 font-medium">Completed</h3>
          <p className="text-3xl font-bold text-green-800">7</p>
          <AppIcon name="check" className="w-12 h-12 mt-2 text-green-600" />
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-purple-600 font-medium">In Progress</h3>
          <p className="text-3xl font-bold text-purple-800">3</p>
          <AppIcon name="clock" className="w-12 h-12 mt-2 text-purple-600" />
        </div>
      </div>
    </div>
  );
}
