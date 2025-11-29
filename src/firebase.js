// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Крок 1: Конфігурація тепер читає ОДИН JSON-рядок
// JSON.parse() перетворює рядок з process.env.REACT_APP_FIREBASE_CONFIG на об'єкт
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG); 

// Крок 2: Ініціалізація додатку
const app = initializeApp(firebaseConfig);

// Крок 3: Отримання сервісів
const auth = getAuth(app);
const db = getFirestore(app);

// Експорт для використання в інших частинах додатка
export { auth, db };