import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration can be provided via Vite environment variables or localStorage
export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  if (typeof window === 'undefined') return null;

  // Check env vars first
  const envConfig: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  // Check localStorage for saved custom credentials
  try {
    const saved = localStorage.getItem('craverse_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading saved firebase config', e);
  }

  return null;
}

export function isFirebaseConfigured(): boolean {
  const config = getStoredFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
}

// Initialize Firebase if config exists, otherwise return null
let appInstance = null;
let authInstance = null;
let dbInstance = null;
let storageInstance = null;

const config = getStoredFirebaseConfig();
if (config && config.apiKey && config.projectId) {
  try {
    appInstance = getApps().length === 0 ? initializeApp(config) : getApp();
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
  } catch (err) {
    console.warn('Firebase initialization error, running in local reactive mode:', err);
  }
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

