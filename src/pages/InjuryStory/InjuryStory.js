import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import './InjuryStory.css';
import bodyImg from '../../assets/images/human_body_outline.png'; // Шлях до картинки

const InjuryStory = () => {
    const [user] = useAuthState(auth);
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({
        location: '',
        date: new Date().toISOString().split('T')[0],
        pain: 5,
        notes: '',
        coordX: 0,
        coordY: 0
    });

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'injuries'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const handleMapClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setFormData({ ...formData, coordX: x.toFixed(2), coordY: y.toFixed(2) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        try {
            await addDoc(collection(db, 'injuries'), {
                ...formData,
                userId: user.uid,
                createdAt: serverTimestamp()
            });
            alert("Травму записано!");
            setFormData({ ...formData, notes: '', location: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Видалити цей запис?")) {
            await deleteDoc(doc(db, 'injuries', id));
        }
    };

    return (
        <div className="injury-page">
            <h1 className="page-title">Injury Story</h1>
            
            <div className="dashboard-container">
                {/* ЛІВА КАРТКА: КАРТА ТІЛА */}
                <div className="form-card">
                    <div className="body-map-container">
                        <img src={bodyImg} alt="Body Map" className="body-silhouette" onClick={handleMapClick} />
                        {/* Поточний маркер (червоний) при виборі */}
                        <div className="injury-marker current" style={{ left: `${formData.coordX}%`, top: `${formData.coordY}%` }}></div>
                        
                        {/* Відображення збережених травм на тілі */}
                        {records.map(rec => (
                            <div key={rec.id} className="injury-marker saved" title={rec.location}
                                 style={{ left: `${rec.coordX}%`, top: `${rec.coordY}%` }}>
                            </div>
                        ))}
                    </div>

                    <form id="injury-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Локація:</label>
                            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Наприклад: Коліно" required />
                        </div>
                        <div className="input-group">
                            <label>Дата:</label>
                            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                        </div>
                        <div className="input-group">
                            <label>Рівень болю (1-10):</label>
                            <input type="range" min="1" max="10" value={formData.pain} onChange={e => setFormData({...formData, pain: e.target.value})} />
                            <span className="pain-display">{formData.pain}/10</span>
                        </div>
                        <textarea placeholder="Ваші коментарі..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                        <button type="submit" className="submit-btn">Записати травму</button>
                    </form>
                </div>

                {/* ПРАВА КАРТКА: ІСТОРІЯ */}
                <div className="chart-card">
                    <h3 className="section-subtitle">📜 Історія травм</h3>
                    <div id="injury-list">
                        {records.length === 0 ? (
                            <p className="placeholder-text">Клікніть на силует або додайте запис.</p>
                        ) : (
                            records.map(rec => (
                                <div key={rec.id} className="history-item">
                                    <div className="history-header">
                                        <strong>{rec.location}</strong>
                                        <span>{rec.date}</span>
                                    </div>
                                    <p>Біль: {rec.pain}/10</p>
                                    <p className="small-notes">{rec.notes}</p>
                                    <button className="delete-btn" onClick={() => handleDelete(rec.id)}>×</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InjuryStory;