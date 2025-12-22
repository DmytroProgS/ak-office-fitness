import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './WeightControl.css';

const WeightControl = () => {
    const [user] = useAuthState(auth);
    const [weight, setWeight] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Важливо: Цей запит вимагає індексу в Firebase!
        const q = query(
            collection(db, 'weightRecords'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'asc') 
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const firebaseData = doc.data();
                const ts = firebaseData.timestamp?.toDate();
                return {
                    id: doc.id,
                    weight: parseFloat(firebaseData.weight),
                    date: ts ? ts.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }) : '',
                    fullDate: ts ? ts.toLocaleString('uk-UA') : 'Обробка...'
                };
            });
            setHistory(data);
            setLoading(false);
        }, (error) => {
            console.error("Помилка Firestore:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !weight) return;

        try {
            await addDoc(collection(db, 'weightRecords'), {
                userId: user.uid,
                weight: parseFloat(weight),
                timestamp: serverTimestamp()
            });
            setWeight('');
        } catch (error) {
            console.error("Помилка при збереженні:", error);
            alert("Помилка! Перевірте консоль (можливо, потрібен індекс)");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Видалити цей запис?")) {
            await deleteDoc(doc(db, 'weightRecords', id));
        }
    };

    if (loading) return <div className="loading-screen">Завантаження статистики...</div>;

    return (
        <div className="wellness-container">
            <h1>КОНТРОЛЬ ВАГИ ТІЛА</h1>

            <div className="weight-grid">
                {/* Форма вводу */}
                <div className="weight-card">
                    <h3>Нове зважування</h3>
                    <form onSubmit={handleSubmit} className="weight-form-inline">
                        <div className="input-wrapper">
                            <input 
                                type="number" 
                                step="0.1" 
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)} 
                                placeholder="00.0"
                                required 
                            />
                            <span className="unit-label">кг</span>
                        </div>
                        <button type="submit" className="submit-button">Зберегти</button>
                    </form>
                </div>

                {/* Секція з графіком */}
                <div className="weight-card chart-section">
                    <h3>Динаміка змін</h3>
                    <div className="chart-box">
                        {history.length > 1 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#888" fontSize={12} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#4CAF50' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="weight" 
                                        stroke="#4CAF50" 
                                        strokeWidth={3} 
                                        dot={{ fill: '#4CAF50', r: 4 }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="placeholder-text">Додайте записи, щоб побачити графік</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Таблиця історії */}
            <div className="weight-history-section">
                <h3>Історія останніх зважувань</h3>
                <div className="weight-table">
                    {[...history].reverse().map(record => (
                        <div key={record.id} className="weight-row">
                            <span className="row-date">{record.fullDate}</span>
                            <span className="row-val">{record.weight} кг</span>
                            <button className="row-del" onClick={() => handleDelete(record.id)}>×</button>
                        </div>
                    ))}
                    {history.length === 0 && <p className="no-data">Записів ще немає</p>}
                </div>
            </div>
        </div>
    );
};

export default WeightControl;