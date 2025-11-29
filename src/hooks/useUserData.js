// src/hooks/useUserData.js

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase'; // db - імпорт Firestore

/**
 * Хук для отримання додаткових даних користувача (ім'я, прізвище) з Firestore
 * @returns {object} {userData, loading, error}
 */
const useUserData = () => {
    // 1. Отримуємо стан автентифікації (UID)
    const [user, loadingAuth] = useAuthState(auth);
    
    // 2. Стан для зберігання даних з Firestore
    const [userData, setUserData] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Запускаємо, якщо автентифікація завершена і користувач увійшов
        if (!loadingAuth && user) {
            
            setLoadingData(true);
            setError(null);

            const fetchUserData = async () => {
                try {
                    // 1. Створюємо посилання на документ користувача в колекції 'users'
                    // UID користувача використовується як ID документа
                    const docRef = doc(db, 'users', user.uid);
                    
                    // 2. Отримуємо документ
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        // Якщо документ знайдено, зберігаємо дані
                        setUserData(docSnap.data());
                    } else {
                        // Якщо дані не знайдено (хоча мали б бути)
                        console.warn("Дані користувача в Firestore не знайдені.");
                        setUserData({ firstName: "User", lastName: "Data Missing" }); // Заглушка
                    }
                } catch (e) {
                    console.error("Помилка при отриманні даних користувача:", e);
                    setError(e);
                } finally {
                    setLoadingData(false);
                }
            };
            
            fetchUserData();
        } else if (!loadingAuth && !user) {
            // Якщо користувач вийшов, очищаємо дані
            setUserData(null);
        }
    }, [user, loadingAuth]); // Залежності: user та loadingAuth

    return { userData, loading: loadingAuth || loadingData, error };
};

export default useUserData;