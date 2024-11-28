// lib/firebaseAdmin.js
import { getAuth } from 'firebase-admin/auth';
import { cert, getApps, initializeApp } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK || '{}');

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminAuth = getAuth();