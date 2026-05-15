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

console.log("FIREBASE KEY:", firebaseConfig.apiKey);

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export { FieldValue };
export const adminAuth = getAuth();