import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDSSLptCmUUlF5qPIGOtcBk6p8Yf8v8Vio",
    authDomain: "luxeon-c5564.firebaseapp.com",
    databaseURL: "https://luxeon-c5564-default-rtdb.firebaseio.com",
    projectId: "luxeon-c5564",
    storageBucket: "luxeon-c5564.firebasestorage.app",
    messagingSenderId: "558924652649",
    appId: "1:558924652649:web:c94ae6b28b95b23e6902f8",
    measurementId: "G-FT06WZ0RLJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
