// src/hooks/useInjuryRecords.js

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

const useInjuryRecords = () => {
    const [user] = useAuthState(auth);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----------------------------------------------------
    // 1. ЛОГІКА ДОДАВАННЯ ТРАВМИ
    // ----------------------------------------------------
    const addInjury = async (injuryData) => {
        if (!user) {
            throw new Error("Користувач не авторизований.");
        }
        
        const newRecord = {
            ...injuryData,
            userId: user.uid,
            // Додаємо дату початку травми (якщо не передано, беремо поточну)
            startDate: injuryData.startDate || new Date(), 
            // Початковий статус
            status: 'активна', 
            // Додаємо час створення запису
            createdAt: new Date(), 
        };

        try {
            // Додаємо запис у колекцію 'injuryRecords'
            await addDoc(collection(db, 'injuryRecords'), newRecord);
            return true;
        } catch (err) {
            console.error("Помилка при додаванні травми:", err);
            throw new Error("Не вдалося додати запис про травму.");
        }
    };

    // ----------------------------------------------------
    // 2. ЛОГІКА ЗАВАНТАЖЕННЯ ІСТОРІЇ
    // ----------------------------------------------------
    useEffect(() => {
        if (!user) {
            setHistory([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Створюємо запит: сортуємо від найновіших травм
        const q = query(
            collection(db, 'injuryRecords'),
            orderBy('startDate', 'desc')
            // ⭐ ПРИМІТКА: Тут ми не фільтруємо за userId, тому що нам потрібно буде додати правило безпеки у Firebase
        );

        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const recordsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Конвертуємо Firebase Timestamp у JS Date
                    startDate: doc.data().startDate?.toDate(),
                    createdAt: doc.data().createdAt?.toDate(),
                }));
                // Фільтруємо на клієнті, поки не налаштуємо правила безпеки
                const userRecords = recordsList.filter(rec => rec.userId === user.uid);
                
                setHistory(userRecords); 
                setLoading(false);
            }, 
            (err) => {
                console.error("Помилка завантаження історії травм:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe(); 
    }, [user]);

    return { history, loading, error, addInjury };
};

export default useInjuryRecords;