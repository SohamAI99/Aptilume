// Storage Service - Handles all Firebase Storage operations
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Upload a file to Firebase Storage
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      metadata: snapshot.metadata
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload a user profile picture
export const uploadProfilePicture = async (file, userId) => {
  try {
    // Create a unique filename to prevent conflicts
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    const path = `profile_pictures/${fileName}`;
    
    return await uploadFile(file, path);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Upload a company logo
export const uploadCompanyLogo = async (file, companyId) => {
  try {
    // Create a unique filename to prevent conflicts
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${companyId}_${timestamp}.${fileExtension}`;
    const path = `company_logos/${fileName}`;
    
    return await uploadFile(file, path);
  } catch (error) {
    console.error('Error uploading company logo:', error);
    throw error;
  }
};

// Upload a quiz asset (images, diagrams, etc.)
export const uploadQuizAsset = async (file, quizId) => {
  try {
    // Create a unique filename to prevent conflicts
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${quizId}_${timestamp}.${fileExtension}`;
    const path = `quiz_assets/${quizId}/${fileName}`;
    
    return await uploadFile(file, path);
  } catch (error) {
    console.error('Error uploading quiz asset:', error);
    throw error;
  }
};

// Get the download URL for a file
export const getFileUrl = async (path) => {
  try {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export default {
  uploadFile,
  uploadProfilePicture,
  uploadCompanyLogo,
  uploadQuizAsset,
  getFileUrl,
  deleteFile
};