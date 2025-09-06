import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as authService from '../../utils/authService';

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
    '/exam-interface'
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

  // Role-based route access
  const roleBasedRoutes = {
    '/admin-dashboard': [authService.USER_ROLES.ADMIN],
    '/teacher-dashboard': [authService.USER_ROLES.TEACHER, authService.USER_ROLES.ADMIN],
    '/student-dashboard': [authService.USER_ROLES.STUDENT, authService.USER_ROLES.TEACHER, authService.USER_ROLES.ADMIN],
    // Admin specific routes
    '/admin/profile': [authService.USER_ROLES.ADMIN],
    '/admin/settings': [authService.USER_ROLES.ADMIN],
    '/admin/users': [authService.USER_ROLES.ADMIN],
    '/admin/quizzes': [authService.USER_ROLES.ADMIN],
    '/admin/reports': [authService.USER_ROLES.ADMIN],
    // Teacher specific routes
    '/teacher/profile': [authService.USER_ROLES.TEACHER, authService.USER_ROLES.ADMIN],
    '/teacher/settings': [authService.USER_ROLES.TEACHER, authService.USER_ROLES.ADMIN],
    '/teacher/create-quiz': [authService.USER_ROLES.TEACHER, authService.USER_ROLES.ADMIN],
    // Student specific routes
    '/student/profile': [authService.USER_ROLES.STUDENT, authService.USER_ROLES.TEACHER, authService.USER_ROLES.ADMIN],
    '/student/settings': [authService.USER_ROLES.STUDENT, authService.USER_ROLES.TEACHER, authService.USER_ROLES.ADMIN],
    '/attempt-history': [authService.USER_ROLES.STUDENT] // Only students can access attempt history
  };

  useEffect(() => {
    let unsubscribeAuth;
    
    const checkAuthState = async () => {
      unsubscribeAuth = authService.auth.onAuthStateChanged(async (user) => {
        const currentPath = location?.pathname;
        
        if (user) {
          // User is authenticated
          // Redirect authenticated users from public-only routes
          if (publicOnlyRoutes?.includes(currentPath)) {
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
          
          // Check role-based access
          if (roleBasedRoutes[currentPath]) {
            try {
              const fullUser = await authService.getCurrentUser();
              const hasAccess = authService.hasAnyRole(fullUser, roleBasedRoutes[currentPath]);
              
              if (!hasAccess) {
                // Redirect to appropriate dashboard based on user role
                const dashboardPath = fullUser?.userType === authService.USER_ROLES.ADMIN 
                  ? '/admin-dashboard' 
                  : fullUser?.userType === authService.USER_ROLES.TEACHER 
                    ? '/teacher-dashboard' 
                    : '/student-dashboard';
                
                navigate(dashboardPath, { 
                  replace: true,
                  state: { 
                    message: 'You do not have permission to access this page.',
                    type: 'error'
                  }
                });
                return;
              }
            } catch (error) {
              console.error('Error checking role-based access:', error);
            }
          }
        } else {
          // User is not authenticated
          // Redirect unauthenticated users from protected routes
          if (protectedRoutes?.includes(currentPath)) {
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
    if (examRoutes?.includes(currentPath)) {
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
      if (!allowedDuringExam?.includes(currentPath)) {
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
          window.history?.pushState(null, '', window.location?.pathname);
        }
      };

      // Push current state to prevent back navigation
      window.history?.pushState(null, '', window.location?.pathname);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
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

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [examState]);

  return <>{children}</>;
};

export default NavigationGuard;