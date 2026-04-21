import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaLRtO5ebZnDYC6ogShT8i488QJX2XxJs",
  authDomain: "sis-big-data.firebaseapp.com",
  projectId: "sis-big-data",
  storageBucket: "sis-big-data.firebasestorage.app",
  messagingSenderId: "390158448117",
  appId: "1:390158448117:web:28344007244a6e7a899cbc",
  measurementId: "G-EFG8Y4DLYM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
