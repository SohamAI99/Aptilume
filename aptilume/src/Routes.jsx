import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
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

// Profile pages
import ProfilePage from './pages/profile';
import AdminProfile from './pages/admin-dashboard/components/AdminProfile';
import TeacherProfile from './pages/teacher-dashboard/components/TeacherProfile';
import StudentProfile from './pages/student-dashboard/components/StudentProfile';

// Settings pages
import SettingsPage from './pages/settings';
import AdminSettings from './pages/admin-dashboard/components/AdminSettings';
import TeacherSettings from './pages/teacher-dashboard/components/TeacherSettings';
import StudentSettings from './pages/student-dashboard/components/StudentSettings';

// Attempt history pages
import AttemptHistoryPage from './pages/attempt-history';
import AttemptHistory from './pages/student-dashboard/components/AttemptHistory';

const Routes = () => {
  return (
    <BrowserRouter>
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
          
          {/* Profile routes */}
          <Route path="/profile" element={<NavigationGuard><ProfilePage /></NavigationGuard>} />
          <Route path="/admin/profile" element={<NavigationGuard><AdminProfile /></NavigationGuard>} />
          <Route path="/teacher/profile" element={<NavigationGuard><TeacherProfile /></NavigationGuard>} />
          <Route path="/student/profile" element={<NavigationGuard><StudentProfile /></NavigationGuard>} />
          
          {/* Settings routes */}
          <Route path="/settings" element={<NavigationGuard><SettingsPage /></NavigationGuard>} />
          <Route path="/admin/settings" element={<NavigationGuard><AdminSettings /></NavigationGuard>} />
          <Route path="/teacher/settings" element={<NavigationGuard><TeacherSettings /></NavigationGuard>} />
          <Route path="/student/settings" element={<NavigationGuard><StudentSettings /></NavigationGuard>} />
          
          {/* Attempt history routes - only for students */}
          <Route path="/attempt-history" element={<NavigationGuard><AttemptHistory /></NavigationGuard>} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;