// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAafIXPTq1RwwXqUXoKBU1GV7zuMe5nOOI",
  authDomain: "quizapp-matek10000.firebaseapp.com",
  projectId: "quizapp-matek10000",
  storageBucket: "quizapp-matek10000.firebasestorage.app",
  messagingSenderId: "392344007567",
  appId: "1:392344007567:web:096ea00c9298971917d1fa",
  measurementId: "G-N5TD49GQJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);