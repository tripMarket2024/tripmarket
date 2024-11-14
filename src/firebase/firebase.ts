// Import the functions you need from the SDKs you need
import { getStorage } from 'firebase/storage';
import { initializeApp, type FirebaseApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
} = {
  apiKey: "AIzaSyBBNyMAWA3kYPOmQq0Xm43FTMQEJXS8zMs",
  authDomain: "tripmarket-18caf.firebaseapp.com",
  projectId: "tripmarket-18caf",
  storageBucket: "tripmarket-18caf.firebasestorage.app",
  messagingSenderId: "673744003967",
  appId: "1:673744003967:web:ec739ddfd74bd9cd47704a"
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(app);
