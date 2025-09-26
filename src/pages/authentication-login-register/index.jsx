import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthHeader from './components/AuthHeader';
import AuthToggle from './components/AuthToggle';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
// import GoogleAuthButton from './components/GoogleAuthButton';
// import GithubAuthButton from './components/GithubAuthButton';
import AuthFooter from './components/AuthFooter';
import { USER_ROLES } from '../../utils/authService';
import * as authService from '../../utils/authService';
import DecorativeBackground from '../../components/DecorativeBackground';

const AuthenticationPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  // const [googleLoading, setGoogleLoading] = useState(false);
  // const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Clear error when tab changes
    setError('');
  }, [activeTab]);

  const mapAuthError = (err) => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/user-not-found':
        return 'No user found with this email. Please register first.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later or reset your password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/popup-closed-by-user':
        return 'The sign-in popup was closed. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup blocked by the browser. Allow popups for this site and try again.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email using a different sign-in method.';
      default:
        return err?.message || 'Authentication failed. Please try again.';
    }
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Login and get full user data including userType
      const user = await authService.loginUser(formData?.email, formData?.password);
      
      // Navigate based on user type
      const dashboardPath = user?.userType === USER_ROLES.ADMIN 
        ? '/admin-dashboard' 
        : user?.userType === USER_ROLES.TEACHER 
          ? '/teacher-dashboard' 
          : '/student-dashboard';
      
      const from = location?.state?.from || dashboardPath;
      navigate(from, { replace: true });
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Map userType to role
      let userType = USER_ROLES.STUDENT;
      switch (formData?.userType) {
        case 'teacher':
          userType = USER_ROLES.TEACHER;
          break;
        case 'admin':
          userType = USER_ROLES.ADMIN;
          break;
        default:
          userType = USER_ROLES.STUDENT;
      }

      await authService.registerUser(
        formData?.email, 
        formData?.password, 
        formData?.fullName, 
        userType
      );
      
      // Navigate based on user type
      const dashboardPath = userType === USER_ROLES.ADMIN 
        ? '/admin-dashboard' 
        : userType === USER_ROLES.TEACHER 
          ? '/teacher-dashboard' 
          : '/student-dashboard';
      
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleAuth = async () => {
  //   setGoogleLoading(true);
  //   setError('');

  //   try {
  //     await authService.signInWithGoogle();
  //     navigate('/student-dashboard', { replace: true });
  //   } catch (err) {
  //     setError(err?.message || 'Google authentication failed. Please try again.');
  //   } finally {
  //     setGoogleLoading(false);
  //   }
  // };

  // const handleGithubAuth = async () => {
  //   setGithubLoading(true);
  //   setError('');

  //   try {
  //     await authService.signInWithGithub();
  //     navigate('/student-dashboard', { replace: true });
  //   } catch (err) {
  //     setError(err?.message || 'GitHub authentication failed. Please try again.');
  //   } finally {
  //     setGithubLoading(false);
  //   }
  // };

  // const handleSeedData = async () => {
  //   setLoading(true);
  //   setError('');
  //   try {
  //     await authService.manuallySeedData();
  //     setError('Data seeded successfully! Refresh the page to see the quizzes.');
  //   } catch (err) {
  //     setError(err?.message || 'Failed to seed data. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: activeTab === 'login' ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: activeTab === 'login' ? 20 : -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <DecorativeBackground />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Main Auth Card */}
        <div className="glass-card rounded-2xl p-8 shadow-elevation-3">
          <AuthHeader activeTab={activeTab} />
          
          <AuthToggle 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          <motion.div
            key={activeTab}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === 'login' ? (
              <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                error={error}
                onForgotPassword={async (email) => {
                  try {
                    if (!email) {
                      setError('Enter your email above, then click Forgot Password');
                      return;
                    }
                    await authService.resetPassword(email);
                    setError('Password reset email sent. Please check your inbox.');
                  } catch (e) {
                    setError(e?.message || 'Could not send password reset email');
                  }
                }}
              />
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                loading={loading}
                error={error}
              />
            )}
          </motion.div>

          {/* 
          <GoogleAuthButton 
            onGoogleAuth={handleGoogleAuth} 
            loading={googleLoading} 
            disabled={loading || githubLoading}
          />
          
          <GithubAuthButton 
            onGithubAuth={handleGithubAuth} 
            loading={githubLoading} 
            disabled={loading || googleLoading}
          />
          */}

          {/* Seed Data Button for Development */}
          {/* 
          <div className="mt-4 text-center">
            <button
              onClick={handleSeedData}
              disabled={loading}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Seed Demo Data
            </button>
          </div>
          */}

          <AuthFooter />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthenticationPage;