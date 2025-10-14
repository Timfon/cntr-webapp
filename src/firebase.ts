import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to Firebase Emulators in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';
  
  if (useEmulators) {
    try {
      // Check if already connected to avoid errors on hot reload
      if (!(auth as any)._config?.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      
      // Firestore emulator doesn't have a similar check, but connectFirestoreEmulator
      // is safe to call multiple times
      if (!(db as any)._settings?.host?.includes('localhost:8080')) {
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
      
      console.log('🔧 Connected to Firebase Emulators');
    } catch (error) {
      console.warn('⚠️ Firebase Emulators connection failed:', error);
    }
  }
}
