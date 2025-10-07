// Authentication Service - Handles all authentication operations and role management
import { auth, db, googleProvider, githubProvider } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from './firebase';
import { seedInitialData } from './seed';

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

// Export auth object directly so it can be used elsewhere
export { auth };

// Create a new user with email and password
export const registerUser = async (email, password, fullName, userType = USER_ROLES.STUDENT) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName: fullName });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: fullName,
      email: email,
      userType: userType,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isActive: true,
      stats: {
        totalTestsTaken: 0,
        totalTestsCreated: 0,
        averageScore: 0,
        highestScore: 0,
        lastActive: serverTimestamp()
      }
    });
    
    // Seed initial data for new user
    await seedInitialData(user);
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in with email and password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login time
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: serverTimestamp()
    });
    
    // Get and return full user data including userType directly
    const userDocSnapshot = await getDoc(doc(db, 'users', user.uid));
    if (userDocSnapshot.exists()) {
      return {
        ...user,
        ...userDocSnapshot.data(),
        id: user.uid
      };
    } else {
      return user;
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || '',
        email: user.email,
        userType: USER_ROLES.STUDENT, // Default to student for social logins
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isActive: true,
        provider: 'google',
        stats: {
          totalTestsTaken: 0,
          totalTestsCreated: 0,
          averageScore: 0,
          highestScore: 0,
          lastActive: serverTimestamp()
        }
      });
      
      // Seed initial data for new user
      await seedInitialData(user);
    } else {
      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: serverTimestamp()
      });
    }
    
    // Get and return full user data including userType directly
    const userDocSnapshot = await getDoc(doc(db, 'users', user.uid));
    if (userDocSnapshot.exists()) {
      return {
        ...user,
        ...userDocSnapshot.data(),
        id: user.uid
      };
    } else {
      return user;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign in with GitHub
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || user.email?.split('@')[0] || '',
        email: user.email,
        userType: USER_ROLES.STUDENT, // Default to student for social logins
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isActive: true,
        provider: 'github',
        stats: {
          totalTestsTaken: 0,
          totalTestsCreated: 0,
          averageScore: 0,
          highestScore: 0,
          lastActive: serverTimestamp()
        }
      });
      
      // Seed initial data for new user
      await seedInitialData(user);
    } else {
      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: serverTimestamp()
      });
    }
    
    // Get and return full user data including userType directly
    const userDocSnapshot = await getDoc(doc(db, 'users', user.uid));
    if (userDocSnapshot.exists()) {
      return {
        ...user,
        ...userDocSnapshot.data(),
        id: user.uid
      };
    } else {
      return user;
    }
  } catch (error) {
    console.error('Error signing in with GitHub:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Listen for auth state changes
export const onUserStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          // Get user data from Firestore
          const userDocSnapshot = await getDoc(doc(db, 'users', user.uid));
          if (userDocSnapshot.exists()) {
            resolve({
              ...user,
              ...userDocSnapshot.data(),
              id: user.uid
            });
          } else {
            resolve(user);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          resolve(user);
        }
      } else {
        resolve(null);
      }
    }, reject);
  });
};

// Get current user ID
export const getCurrentUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};