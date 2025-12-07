// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'; 

const useUserData = () => {
    const [user, loadingAuth] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (loadingAuth) return; 

        if (user) {
            setLoadingData(true); // Починаємо завантаження даних
            const docRef = doc(db, 'users', user.uid);
            
            // onSnapshot встановлює постійне прослуховування
            const unsubscribe = onSnapshot(docRef, 
                (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data()); 
                    } else {
                        setUserData(null);
                    }
                    // ВАЖЛИВО: setLoadingData(false) має спрацювати після першої відповіді
                    setLoadingData(false); 
                }, 
                (error) => {
                    console.error("Помилка завантаження даних користувача:", error);
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
    }, [user, loadingAuth]); // Залежності: user і loadingAuth

    return { userData, loading: loadingData };
};

export default useUserData;