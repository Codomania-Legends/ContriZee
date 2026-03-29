// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0_uDXd-Q9IYwbvjSeMMpGhV4y9yxWg9E",
  authDomain: "contrizee.firebaseapp.com",
  projectId: "contrizee",
  storageBucket: "contrizee.firebasestorage.app",
  messagingSenderId: "924750830174",
  appId: "1:924750830174:web:7771491117145e39e0b2cf",
  measurementId: "G-D8DHNLR0V2",
  databaseURL : "https://contrizee-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);