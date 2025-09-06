import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ProfilePage from './pages/profile.jsx';
import SettingsPage from './pages/settings.jsx';
import AttemptHistoryPage from './pages/attempt-history.jsx';
import ExamPage from './pages/exam-interface/ExamPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <div>Authentication login/register page</div>,
  },
  {
    path: '/dashboard',
    element: <div>Admin dashboard</div>,
  },
  {
    path: '/exam',
    element: <ExamPage />,
  },
  {
    path: '/results',
    element: <div>Results and review</div>,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/attempt-history',
    element: <AttemptHistoryPage />,
  },
]);

export default router;
