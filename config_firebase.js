// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmvLcL8zLLD-PonHjoz4SA1AL4xwjVH8M",
  authDomain: "electrodom-57313.firebaseapp.com",
  projectId: "electrodom-57313",
  storageBucket: "electrodom-57313.firebasestorage.app",
  messagingSenderId: "206763037046",
  appId: "1:206763037046:web:8630b01d88958e64f1aa57",
  measurementId: "G-WSGTHTQZX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
