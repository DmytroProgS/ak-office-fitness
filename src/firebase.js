// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// КОПІЮВАТИ ТІЛЬКИ ЦЕЙ ОБ'ЄКТ (значення ключів з вашого скріншота)
const firebaseConfig = {
  apiKey: "AIzaSyD5O5pqaEK5i9ECCCI7Lri-zq_RfdqbKSc",
  authDomain: "ak-office-fitness.firebaseapp.com",    
  projectId: "ak-office-fitness",
  storageBucket: "ak-office-fitness.appspot.com",
  messagingSenderId: "439315765252",
  appId: "1:439315765252:web:eefd85e05c3add6843fd51"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 
const db = getFirestore(app); 

export { auth, db };