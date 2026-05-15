import { initializeApp } from 'firebase/app'
import {
    getAuth,
    setPersistence,
    browserSessionPersistence,
} from "firebase/auth";
// import { getAuth } from 'firebase/auth'

const rconst firebaseConfig = {
    apiKey: "AIzaSyBXL6Wo5gtrkxYu-NRcZyYy29n7fkU8qFM",
    authDomain: "pulsevote-117.firebaseapp.com",
    projectId: "pulsevote-117",
    storageBucket: "pulsevote-117.firebasestorage.app",
    messagingSenderId: "264797894885",
    appId: "1:264797894885:web:b66d365fb980706307bc0c",
    measurementId: "G-M09KD98KCY"
};

// console.log("FIREBASE KEY:", import.meta.env.VITE_FIREBASE_API_KEY);

// for (const key of requiredKeys) {
//     if (!import.meta.env[key]) {
//         throw new Error(`Missing environment variable: ${key}`);
//     }
// }

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
console.log("FIREBASE KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("Session persistence enabled");
    })
    .catch(error => {
        console.error("Persistence error:", error);
    });
