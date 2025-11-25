// Importar todos los módulos necesarios para CRUD
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmvLcL8zLLD-PonHjoz4SA1AL4wjVH8M",
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
const db = getFirestore(app);

// Exportar todas las funciones para CRUD
export { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc 
};

