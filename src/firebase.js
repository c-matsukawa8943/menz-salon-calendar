import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAaIytxGGH21Jmic771CH5M852afjPbHg0",
    authDomain: "react-salon-project-2eb00.firebaseapp.com",
    projectId: "react-salon-project-2eb00",
    storageBucket: "react-salon-project-2eb00.firebasestorage.app",
    messagingSenderId: "630766276296",
    appId: "1:630766276296:web:3e59c15db63feec959dffd"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };