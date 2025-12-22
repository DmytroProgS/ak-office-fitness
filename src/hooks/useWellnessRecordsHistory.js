import { useState, useEffect } from 'react';
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'; 

// Хук повертає всі записи Wellness за останні N днів
const useWellnessRecordsHistory = (days = 30) => {
    const [user] = useAuthState(auth);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Якщо користувач не авторизований, нічого не завантажуємо
        if (!user) {
            setHistory([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // 1. Обчислюємо дату початку (сьогодні мінус кількість днів)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // 2. Посилання на ЗАГАЛЬНУ колекцію 'wellnessRecords'
        const recordsRef = collection(db, 'wellnessRecords');
        
        // 3. Створюємо складний запит
        // ВАЖЛИВО: Цей запит потребує ІНДЕКСУ у Firebase (посилання буде в консолі браузера)
        const q = query(
            recordsRef,
            where('userId', '==', user.uid), // Тільки дані поточного користувача
            where('timestamp', '>=', startDate), // За вказаний період
            orderBy('timestamp', 'asc') // Від старіших до новіших для графіка
        );

        // 4. Слухач реального часу
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const recordsList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data, // Спочатку копіюємо всі поля
                        // Потім ПЕРЕЗАПИСУЄМО timestamp, конвертуючи його з Firebase Format у JS Date
                        timestamp: data.timestamp?.toDate() 
                    };
                });
                setHistory(recordsList); 
                setLoading(false);
            }, 
            (err) => {
                console.error("Помилка завантаження історії Wellness:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        // Відписуємось від слухача при видаленні компонента
        return () => unsubscribe(); 

    }, [user, days]); 

    return { history, loading, error };
};

export default useWellnessRecordsHistory;