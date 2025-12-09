// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'; 

const useUserData = () => {
    const [user, loadingAuth] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    
    // Встановлюємо loadingData в true, поки не отримаємо перший результат з useAuthState
    const [loadingData, setLoadingData] = useState(true); 

    useEffect(() => {
        // 1. Чекаємо, поки useAuthState визначиться
        if (loadingAuth) return; 
        
        // Встановлюємо loadingData в true при зміні користувача, якщо він є.
        // Це спрацює лише один раз після завантаження useAuthState.
        if (user) {
            setLoadingData(true); 
            const docRef = doc(db, 'users', user.uid);
            
            // onSnapshot встановлює постійне прослуховування даних користувача
            const unsubscribe = onSnapshot(docRef, 
                (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData({ ...docSnap.data(), uid: user.uid }); // ⭐ ПОКРАЩЕННЯ: Додаємо UID до даних
                    } else {
                        // Якщо документ не знайдено (хоча він є у вашій базі), повертаємо лише UID та email
                        setUserData({ uid: user.uid, email: user.email }); 
                    }
                    // ВАЖЛИВО: setLoadingData(false) має спрацювати після першої відповіді
                    setLoadingData(false); 
                }, 
                (error) => {
                    console.error("Помилка завантаження даних користувача:", error);
                    // Навіть у разі помилки ми припиняємо завантаження
                    setLoadingData(false);
                }
            );

            // Функція очищення (відписка від слухача)
            return () => unsubscribe(); 

        } else {
            // Користувач вийшов або не увійшов
            setUserData(null);
            setLoadingData(false);
        }
    }, [user, loadingAuth]); 

    return { userData, loading: loadingData };
};

export default useUserData;