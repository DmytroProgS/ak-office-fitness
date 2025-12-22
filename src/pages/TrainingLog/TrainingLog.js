import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import './TrainingLog.css';

const TrainingLog = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    
    // Поля форми
    const [type, setType] = useState('Силове');
    const [duration, setDuration] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'trainingSessions'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp?.toDate().toLocaleDateString('uk-UA') || 'Завантаження...'
            }));
            setSessions(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !duration) return;

        try {
            await addDoc(collection(db, 'trainingSessions'), {
                userId: user.uid,
                type,
                duration: parseInt(duration),
                intensity: parseInt(intensity),
                comment,
                timestamp: serverTimestamp()
            });
            // Скидання форми
            setDuration('');
            setComment('');
            setIntensity(5);
        } catch (error) {
            console.error("Помилка збереження:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Видалити цей запис про тренування?")) {
            await deleteDoc(doc(db, 'trainingSessions', id));
        }
    };

    if (loading) return <div className="loading-screen">Завантаження журналу...</div>;

    return (
        <div className="wellness-container">
            <h1>ЩОДЕННИК ТРЕНУВАНЬ</h1>

            <div className="training-grid">
                {/* Форма додавання */}
                <div className="training-card form-section">
                    <h3>Записати активність</h3>
                    <form onSubmit={handleSubmit} className="training-form">
                        <div className="input-group">
                            <label>Тип активності</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="Силове">Силове тренування</option>
                                <option value="Кардіо">Кардіо / Біг</option>
                                <option value="Офісна розминка">Офісна розминка</option>
                                <option value="Йога/Розтяжка">Йога / Розтяжка</option>
                                <option value="Інше">Інше</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Тривалість (хв)</label>
                            <input 
                                type="number" 
                                value={duration} 
                                onChange={(e) => setDuration(e.target.value)} 
                                placeholder="Наприклад: 45" 
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Інтенсивність (RPE): {intensity}/10</label>
                            <input 
                                type="range" 
                                min="1" max="10" 
                                value={intensity} 
                                onChange={(e) => setIntensity(e.target.value)} 
                            />
                            <div className="range-labels">
                                <span>Легко</span>
                                <span>Максимум</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Коментарі (вправи, самопочуття)</label>
                            <textarea 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)} 
                                placeholder="Що сьогодні робили?"
                            />
                        </div>

                        <button type="submit" className="submit-button">Зберегти тренування</button>
                    </form>
                </div>

                {/* Список останніх тренувань */}
                <div className="training-card history-section">
                    <h3>Останні заняття</h3>
                    <div className="session-list">
                        {sessions.map(session => (
                            <div key={session.id} className="session-item">
                                <div className="session-header">
                                    <span className="session-type">{session.type}</span>
                                    <span className="session-date">{session.date}</span>
                                </div>
                                <div className="session-details">
                                    <span>⏱ {session.duration} хв</span>
                                    <span>🔥 Інтенсивність: {session.intensity}/10</span>
                                </div>
                                {session.comment && <p className="session-comment">"{session.comment}"</p>}
                                <button className="delete-session" onClick={() => handleDelete(session.id)}>Видалити</button>
                            </div>
                        ))}
                        {sessions.length === 0 && <p className="no-data">Тренувань ще не записано</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingLog;