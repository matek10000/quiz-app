// Importujemy wymagane funkcje
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "quizapp-matek10000",
  storageBucket: "quizapp-matek10000.firebasestorage.app",
  messagingSenderId: "***REMOVED***",
  appId: "1:***REMOVED***:web:096ea00c9298971917d1fa",
  measurementId: "G-N5TD49GQJB",
};

// Inicjalizujemy Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Analytics w środowisku przeglądarki
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics nie jest obsługiwane w tym środowisku.");
    }
  });
}

// Eksportujemy aplikację i Analytics
export { app, analytics };
