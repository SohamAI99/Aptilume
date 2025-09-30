import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as authService from '../../utils/authService';
import { auth } from '../../utils/firebase'; // Import auth directly

const NavigationGuard = ({ 
  children, 
  examState = null 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Protected routes that require authentication
  const protectedRoutes = [
    '/student-dashboard',
    '/teacher-dashboard',
    '/admin-dashboard',
    '/quiz-rules-instructions', 
    '/password-gate-verification',
    '/exam-interface',
    '/leaderboard', // Add leaderboard to protected routes
    '/results-review',
    '/student/quizzes',
    '/student/analytics',
    '/student/resources',
    '/student/attempt-history',
    '/student/profile',
    '/student/settings'
  ];

  // Routes that should redirect authenticated users
  const publicOnlyRoutes = [
    '/landing-page',
    '/authentication-login-register'
  ];

  // Exam-specific routes that require exam session
  const examRoutes = [
    '/quiz-rules-instructions',
    '/password-gate-verification', 
    '/exam-interface'
  ];

  useEffect(() => {
    let unsubscribeAuth;
    
    const checkAuthState = async () => {
      // Use the auth object directly instead of authService.auth
      unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
        const currentPath = location?.pathname;
        
        // Ensure currentPath is a string before using includes
        if (typeof currentPath !== 'string') {
          return;
        }
        
        if (user) {
          // User is authenticated
          // Redirect authenticated users from public-only routes
          if (Array.isArray(publicOnlyRoutes) && publicOnlyRoutes.includes(currentPath)) {
            // Get full user data to determine dashboard path
            try {
              const fullUser = await authService.getCurrentUser();
              const dashboardPath = fullUser?.userType === authService.USER_ROLES.ADMIN 
                ? '/admin-dashboard' 
                : fullUser?.userType === authService.USER_ROLES.TEACHER 
                  ? '/teacher-dashboard' 
                  : '/student-dashboard';
              
              navigate(dashboardPath, { replace: true });
              return;
            } catch (error) {
              console.error('Error getting user data:', error);
              navigate('/student-dashboard', { replace: true });
              return;
            }
          }
        } else {
          // User is not authenticated
          // Redirect unauthenticated users from protected routes
          if (Array.isArray(protectedRoutes) && protectedRoutes.includes(currentPath)) {
            navigate('/authentication-login-register', { 
              replace: true,
              state: { from: currentPath }
            });
            return;
          }
        }
      });
    };

    checkAuthState();

    // Exam flow restrictions with session-based fallbacks
    const currentPath = location?.pathname;
    // Ensure currentPath is a string before using includes
    if (typeof currentPath === 'string' && Array.isArray(examRoutes) && examRoutes.includes(currentPath)) {
      const attemptId = location?.state?.attemptId || sessionStorage.getItem('currentAttemptId');
      const fromRules = location?.state?.fromRules || sessionStorage.getItem('fromRules');

      if (currentPath === '/exam-interface') {
        if (!attemptId) {
          navigate('/student-dashboard', { 
            replace: true,
            state: { 
              message: 'Please start the exam from the dashboard.',
              type: 'warning'
            }
          });
          return;
        }
      }

      if (currentPath === '/password-gate-verification') {
        if (!fromRules) {
          navigate('/quiz-rules-instructions', { 
            replace: true,
            state: { 
              message: 'Please read and accept the exam rules first.',
              type: 'info'
            }
          });
          return;
        }
      }
    }

    if (examState?.isActive && examState?.hasStarted) {
      const allowedDuringExam = ['/exam-interface'];
      if (Array.isArray(allowedDuringExam) && allowedDuringExam.includes(currentPath)) {
        const confirmExit = window.confirm(
          'You have an active exam session. Leaving will end your exam. Are you sure?'
        );
        if (!confirmExit) {
          navigate('/exam-interface', { replace: true });
          return;
        } else {
          console.log('Exam session ended by navigation');
        }
      }
    }

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [location?.pathname, examState, navigate]);

  // Prevent browser back/forward during exam
  useEffect(() => {
    if (examState?.isActive && examState?.hasStarted) {
      const handlePopState = (event) => {
        event?.preventDefault();
        const confirmExit = window.confirm(
          'You cannot navigate away during an active exam. Do you want to exit the exam?'
        );
        
        if (confirmExit) {
          // Handle exam exit
          navigate('/student-dashboard', { replace: true });
        } else {
          // Stay on current page
          if (window.history?.pushState) {
            window.history.pushState(null, '', window.location?.pathname);
          }
        }
      };

      // Push current state to prevent back navigation
      if (window.history?.pushState) {
        window.history.pushState(null, '', window.location?.pathname);
        window.addEventListener('popstate', handlePopState);
      }

      return () => {
        if (window.removeEventListener) {
          window.removeEventListener('popstate', handlePopState);
        }
      };
    }
  }, [examState, navigate]);

  // Prevent page refresh during exam
  useEffect(() => {
    if (examState?.isActive && examState?.hasStarted) {
      const handleBeforeUnload = (event) => {
        event?.preventDefault();
        event.returnValue = 'You have an active exam. Refreshing will end your exam session.';
        return event?.returnValue;
      };

      if (window.addEventListener) {
        window.addEventListener('beforeunload', handleBeforeUnload);
      }

      return () => {
        if (window.removeEventListener) {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        }
      };
    }
  }, [examState]);

  return <>{children}</>;
};

export default NavigationGuard;