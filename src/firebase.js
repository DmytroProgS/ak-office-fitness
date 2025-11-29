// src/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// УВАГА: СКОПІЮЙТЕ ПОВНУ КОНФІГУРАЦІЮ З ВАШОЇ КОНСОЛІ FIREBASE
// Зокрема, ЗАМІНІТЬ 'ВАШ_НОВИЙ_API_KEY' на новий ключ.
const firebaseConfig = {
  apiKey: "AIzaSyA8zAyIjrqrfFuvfV7uMUy_42Vjy92fMqc", // <--- ЦЕЙ РЯДОК МАЄ МІСТИТИ НОВИЙ КЛЮЧ!
  authDomain: "ak-office-fitness.firebaseapp.com",
  projectId: "ak-office-fitness",
  storageBucket: "ak-office-fitness.appspot.com",
  messagingSenderId: "439315765252",
  appId: "1:439315765252:web:eefd85e05c3add6843fd51",
  // Додайте інші поля, якщо вони є у вашій конфігурації
};

let app;

// Цей блок запобігає повторній ініціалізації
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Ініціалізація сервісів
const auth = getAuth(app);
const db = getFirestore(app);

// Експорт сервісів для використання в додатку
export { auth, db };