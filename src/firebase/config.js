import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// إعدادات Firebase من متغيرات البيئة أو الإعدادات المباشرة
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAXR6Ts0pnZLEnus7ofjq3AGVPSZ_9j7c0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "salasah-745d0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "salasah-745d0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "salasah-745d0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1033850547655",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1033850547655:web:cb50af5cd50f38f3b8bde2",
  measurementId: "G-CTQRGBEGTJ"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير خدمات Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 