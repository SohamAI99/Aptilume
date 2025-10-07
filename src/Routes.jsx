import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/FixedErrorBoundary";
import NotFound from "./pages/NotFound";
import AuthenticationPage from './pages/authentication-login-register';
import QuizRulesInstructions from './pages/quiz-rules-instructions';
import LandingPage from './pages/landing-page';
import ExamInterface from './pages/exam-interface';
import StudentDashboard from './pages/student-dashboard';
import PasswordGateVerification from './pages/password-gate-verification';
import SubmitConfirmationModal from './pages/submit-confirmation-modal';
import ResultsReview from './pages/results-review';
import AdminDashboard from './pages/admin-dashboard';
import TeacherDashboard from './pages/teacher-dashboard';
import NavigationGuard from './components/ui/NavigationGuard';
import Leaderboard from './pages/leaderboard';

// Profile pages
import ProfilePage from './pages/profile';
import AdminProfile from './pages/admin-dashboard/components/AdminProfile';
import TeacherProfile from './pages/teacher-dashboard/components/TeacherProfile';
import StudentProfilePage from './pages/student-dashboard/profile';

// Settings pages
import SettingsPage from './pages/settings';
import AdminSettings from './pages/admin-dashboard/components/AdminSettings';
import TeacherSettings from './pages/teacher-dashboard/components/TeacherSettings';
import StudentSettingsPage from './pages/student-dashboard/settings';

// Attempt history pages
import AttemptHistory from './pages/student-dashboard/components/AttemptHistory';
import StudentAttemptHistory from './pages/student-dashboard/attempt-history'; // Add this import

// Teacher dashboard pages
import CreateQuiz from './pages/teacher-dashboard/create-quiz';
import MyQuizzes from './pages/teacher-dashboard/my-quizzes';
import Students from './pages/teacher-dashboard/students';
import Analytics from './pages/teacher-dashboard/analytics';
import AIAssistance from './pages/teacher-dashboard/ai-assistance';
import QuizAnalytics from './pages/teacher-dashboard/quiz-analytics';

// Student dashboard pages
import StudentQuizzes from './pages/student-dashboard/quizzes';
import StudentAnalytics from './pages/student-dashboard/analytics';
import StudentResources from './pages/student-dashboard/resources';

// Admin dashboard pages
import AdminUsersPage from './pages/admin-dashboard/users';
import AdminQuizzesPage from './pages/admin-dashboard/quizzes';
import AdminReportsPage from './pages/admin-dashboard/reports';

// Quiz editor page
import QuizEditor from './pages/teacher-dashboard/quiz-editor';

// Health check
import FirebaseHealthCheck from './components/FirebaseHealthCheck';

const Routes = () => {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/authentication-login-register" element={<AuthenticationPage />} />
          <Route path="/landing-page" element={<LandingPage />} />

          {/* Protected routes - wrap elements with NavigationGuard */}
          <Route path="/quiz-rules-instructions" element={<NavigationGuard><QuizRulesInstructions /></NavigationGuard>} />
          <Route path="/password-gate-verification" element={<NavigationGuard><PasswordGateVerification /></NavigationGuard>} />
          <Route path="/exam-interface" element={<NavigationGuard><ExamInterface /></NavigationGuard>} />
          <Route path="/student-dashboard" element={<NavigationGuard><StudentDashboard /></NavigationGuard>} />
          <Route path="/teacher-dashboard" element={<NavigationGuard><TeacherDashboard /></NavigationGuard>} />
          <Route path="/admin-dashboard" element={<NavigationGuard><AdminDashboard /></NavigationGuard>} />
          <Route path="/submit-confirmation-modal" element={<NavigationGuard><SubmitConfirmationModal /></NavigationGuard>} />
          <Route path="/results-review" element={<NavigationGuard><ResultsReview /></NavigationGuard>} />
          <Route path="/leaderboard" element={<NavigationGuard><Leaderboard /></NavigationGuard>} />
          
          {/* Student dashboard routes */}
          <Route path="/student/quizzes" element={<NavigationGuard><StudentQuizzes /></NavigationGuard>} />
          <Route path="/student/analytics" element={<NavigationGuard><StudentAnalytics /></NavigationGuard>} />
          <Route path="/student/resources" element={<NavigationGuard><StudentResources /></NavigationGuard>} />
          <Route path="/student/attempt-history" element={<NavigationGuard><StudentAttemptHistory /></NavigationGuard>} /> {/* Add this route */}
          
          {/* Teacher dashboard routes */}
          <Route path="/teacher/create-quiz" element={<NavigationGuard><CreateQuiz /></NavigationGuard>} />
          <Route path="/teacher/quizzes" element={<NavigationGuard><MyQuizzes /></NavigationGuard>} />
          <Route path="/teacher/students" element={<NavigationGuard><Students /></NavigationGuard>} />
          <Route path="/teacher/analytics" element={<NavigationGuard><Analytics /></NavigationGuard>} />
          <Route path="/teacher/ai-assistance" element={<NavigationGuard><AIAssistance /></NavigationGuard>} />
          <Route path="/teacher/quiz/:quizId/edit" element={<NavigationGuard><QuizEditor /></NavigationGuard>} />
          <Route path="/teacher/quiz/:quizId/analytics" element={<NavigationGuard><QuizAnalytics /></NavigationGuard>} />
          
          {/* Profile routes */}
          <Route path="/profile" element={<NavigationGuard><ProfilePage /></NavigationGuard>} />
          <Route path="/admin/profile" element={<NavigationGuard><AdminProfile /></NavigationGuard>} />
          <Route path="/teacher/profile" element={<NavigationGuard><TeacherProfile /></NavigationGuard>} />
          <Route path="/student/profile" element={<NavigationGuard><StudentProfilePage /></NavigationGuard>} />
          
          {/* Settings routes */}
          <Route path="/settings" element={<NavigationGuard><SettingsPage /></NavigationGuard>} />
          <Route path="/admin/settings" element={<NavigationGuard><AdminSettings /></NavigationGuard>} />
          <Route path="/teacher/settings" element={<NavigationGuard><TeacherSettings /></NavigationGuard>} />
          <Route path="/student/settings" element={<NavigationGuard><StudentSettingsPage /></NavigationGuard>} />
          
          {/* Attempt history routes - only for students */}
          <Route path="/attempt-history" element={<NavigationGuard><AttemptHistory /></NavigationGuard>} />
          
          {/* Admin dashboard routes */}
          <Route path="/admin/users" element={<NavigationGuard><AdminUsersPage /></NavigationGuard>} />
          <Route path="/admin/quizzes" element={<NavigationGuard><AdminQuizzesPage /></NavigationGuard>} />
          <Route path="/admin/reports" element={<NavigationGuard><AdminReportsPage /></NavigationGuard>} />

          {/* Health check route */}
          <Route path="/health/firebase" element={<FirebaseHealthCheck />} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;