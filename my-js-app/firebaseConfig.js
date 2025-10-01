import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBEtYHZdhmqTjBrHyXA-QQwX74uRV8DvVM",
  authDomain: "projecttracker-ffafb.firebaseapp.com",
  projectId: "projecttracker-ffafb",
  storageBucket: "projecttracker-ffafb.firebasestorage.app",
  messagingSenderId: "54936357913",
  appId: "1:54936357913:web:c8fe5472ed6bc178bdae88"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
