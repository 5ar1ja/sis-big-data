import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyCaLRtO5ebZnDYC6ogShT8i488QJX2XxJs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "sis-big-data.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "sis-big-data",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "sis-big-data.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "390158448117",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:390158448117:web:28344007244a6e7a899cbc",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// All Firebase Security Rules require auth — sign in anonymously on startup.
signInAnonymously(auth).catch((err) => console.error("Anonymous sign-in failed:", err));
