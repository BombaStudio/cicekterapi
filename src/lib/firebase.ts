// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXj5aEn6XGj0upArqnaHIvvS4qkoa00c4",
  authDomain: "cicekterapi-a7447.firebaseapp.com",
  projectId: "cicekterapi-a7447",
  storageBucket: "cicekterapi-a7447.firebasestorage.app",
  messagingSenderId: "1084288805836",
  appId: "1:1084288805836:web:7a4cbc858715d85e8c0b69",
  measurementId: "G-48WTZ0FHV4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
