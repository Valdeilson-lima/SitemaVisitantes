import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp,
    query,
    where,
    getDocs 
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtxBLMPfVuo3W3Pshmv8jT1IyJdyazSd0",
    authDomain: "visitantesapp-bebfb.firebaseapp.com",
    projectId: "visitantesapp-bebfb",
    storageBucket: "visitantesapp-bebfb.firebasestorage.app",
    messagingSenderId: "213042264374",
    appId: "1:213042264374:web:33b4a9307f5c0571f1db97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export { 
    collection, 
    addDoc, 
    serverTimestamp, 
    onAuthStateChanged,
    query,
    where,
    getDocs 
};