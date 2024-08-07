// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjpFuQ0Mg9KnthmToMXMw_c0tXIBY2rKo",
  authDomain: "mycrick88497.firebaseapp.com",
  databaseURL: "https://mycrick88497-default-rtdb.firebaseio.com",
  projectId: "mycrick88497",
  storageBucket: "mycrick88497.appspot.com",
  messagingSenderId: "731647894608",
  appId: "1:731647894608:web:3a9267b6b77074a95f9d55",
  measurementId: "G-RDSDMX8ZZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { app, database };
