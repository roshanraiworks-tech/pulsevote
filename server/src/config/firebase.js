import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
    apiKey: "AIzaSyBXL6Wo5gtrkxYu-NRcZyYy29n7fkU8qFM",
    authDomain: "pulsevote-117.firebaseapp.com",
    projectId: "pulsevote-117",
    storageBucket: "pulsevote-117.firebasestorage.app",
    messagingSenderId: "264797894885",
    appId: "1:264797894885:web:b66d365fb980706307bc0c",
    measurementId: "G-M09KD98KCY"
};

console.log("FIREBASE KEY:", import.meta.env.VITE_FIREBASE_API_KEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
//     throw new Error(
//         "Missing Firebase Admin credentials. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
//     )
// }

// if (!getApps().length) {
//     initializeApp({
//         credential: cert({
//             projectId: process.env.FIREBASE_PROJECT_ID,
//             clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//             privateKey,
//         }),
//     });
// }

export const db = getFirestore();
export { FieldValue };
export const adminAuth = getAuth();