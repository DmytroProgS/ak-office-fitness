import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import './InjuryStory.css';

const InjuryStory = () => {
    const [user] = useAuthState(auth);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false); // Для сповіщення про успіх
    
    // Поля форми
    const [injuryType, setInjuryType] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    // 1. Отримання даних з Firestore у реальному часі
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'injuryRecords'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc') // Нові зверху
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecords(data);
            setLoading(false);
        }, (error) => {
            console.error("Помилка завантаження травм:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // 2. Збереження нової травми
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            await addDoc(collection(db, 'injuryRecords'), {
                userId: user.uid,
                injuryType,
                date,
                description,
                timestamp: serverTimestamp()
            });

            // Показуємо успіх та очищуємо форму
            setShowSuccess(true);
            setInjuryType('');
            setDate('');
            setDescription('');

            // Приховуємо сповіщення через 3 секунди
            setTimeout(() => setShowSuccess(false), 3000);

        } catch (error) {
            console.error("Помилка при збереженні:", error);
            alert("❌ Не вдалося зберегти запис. Перевірте консоль (можливо, потрібен індекс).");
        }
    };

    // 3. Видалення запису (опціонально, але корисно)
    const handleDelete = async (id) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей запис?")) {
            try {
                await deleteDoc(doc(db, 'injuryRecords', id));
            } catch (error) {
                console.error("Помилка при видаленні:", error);
            }
        }
    };

    return (
        <div className="wellness-container">
            <h1>ІСТОРІЯ ТРАВМ ТА ЗАХВОРЮВАНЬ</h1>

            {/* Тост-сповіщення */}
            {showSuccess && (
                <div className="success-toast">
                    ✅ Запис успішно додано до історії!
                </div>
            )}

            <form onSubmit={handleSubmit} className="wellness-form">
                <div className="form-group">
                    <label>Тип травми / захворювання:</label>
                    <input 
                        type="text" 
                        value={injuryType} 
                        onChange={(e) => setInjuryType(e.target.value)} 
                        placeholder="Наприклад: Розтягнення м'яза стегна"
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Дата виникнення:</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Опис та стан лікування:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Як лікуєте, що каже лікар..."
                        rows="3"
                    />
                </div>
                <button type="submit" className="submit-button">Додати запис</button>
            </form>

            <hr className="divider" />

            <h2>Ваші попередні записи:</h2>
            
            {loading ? (
                <p>Завантаження даних...</p>
            ) : (
                <div className="injury-list">
                    {records.length === 0 ? (
                        <p className="no-data">Записів поки немає.</p>
                    ) : (
                        records.map((record) => (
                            <div key={record.id} className="injury-card">
                                <div className="injury-card-header">
                                    <h3>{record.injuryType}</h3>
                                    <span className="injury-date">{record.date}</span>
                                </div>
                                <div className="injury-card-body">
                                    <p><strong>Опис:</strong> {record.description || 'Немає опису'}</p>
                                    
                                    {/* Відображення зон болю з Wellness-контролю, якщо вони є */}
                                    {record.painArea && (
                                        <p className="pain-zones">
                                            <strong>Зони болю:</strong> {Array.isArray(record.painArea) ? record.painArea.join(', ') : record.painArea}
                                        </p>
                                    )}
                                </div>
                                <button 
                                    className="delete-link" 
                                    onClick={() => handleDelete(record.id)}
                                >
                                    Видалити запис
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default InjuryStory;