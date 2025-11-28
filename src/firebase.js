import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Крок 1: Конфігурація використовує змінні середовища
// process.env.REACT_APP_... — це єдиний безпечний спосіб
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "ak-office-fitness.firebaseapp.com",
  projectId: "ak-office-fitness",
  storageBucket: "ak-office-fitness.appspot.com",
  messagingSenderId: "439315765252",
  appId: "1:439315765252:web:eefd85e05c3add6843fd51",
};

// Крок 2: Ініціалізація додатку
const app = initializeApp(firebaseConfig);

// Крок 3: Отримання сервісів
const auth = getAuth(app);
const db = getFirestore(app);

// Експорт для використання в інших частинах додатка
export { auth, db };