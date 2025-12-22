// src/hooks/useLastWellnessRecord.js
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'; 

// Хук повертає останній запис Wellness
const useLastWellnessRecord = () => {
    const [user] = useAuthState(auth);
    const [lastRecord, setLastRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setLastRecord(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const recordsRef = collection(db, 'users', user.uid, 'wellnessRecords');
        
        // Запит: сортуємо за спаданням (найновіший зверху) і обмежуємо до одного
        const q = query(
            recordsRef,
            orderBy('timestamp', 'desc'), 
            limit(1) 
        );

        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                if (snapshot.docs.length > 0) {
                    const doc = snapshot.docs[0];
                    setLastRecord({
                        id: doc.id,
                        ...doc.data()
                    });
                } else {
                    setLastRecord(null);
                }
                setLoading(false);
            }, 
            (err) => {
                console.error("Помилка завантаження останнього запису Wellness:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe(); 
        
    }, [user]); 

    return { lastRecord, loading, error };
};

export default useLastWellnessRecord;