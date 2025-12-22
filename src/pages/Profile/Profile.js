// src/pages/Profile/Profile.js

import React, { useState } from 'react';
import useUserData from '../../hooks/useUserData'; // Для отримання даних
import { doc, updateDoc } from 'firebase/firestore'; // Для оновлення даних
import { db } from '../../firebase'; // З'єднання з Firestore

import './Profile.css'; // Будемо створювати

const Profile = () => {
    // Отримуємо дані користувача через хук
    const { userData, loading: loadingData, error } = useUserData();
    
    // Стан для керування режимом редагування
    const [isEditing, setIsEditing] = useState(false);
    
    // Стан для зберігання даних форми
    const [formData, setFormData] = useState({ 
        firstName: '', 
        lastName: '', 
        birthDate: '', 
        height: '', 
        weight: '',
        goal: '', 
    });
    
    // Стан для відображення повідомлень про оновлення
    const [updateStatus, setUpdateStatus] = useState(null); // 'success', 'error', 'loading'

    // ⭐ 1. Заповнення форми даними користувача при завантаженні
    React.useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                // Поле birthDate може бути порожнім, це нормально
                birthDate: userData.birthDate || '', 
                height: userData.height || '',
                weight: userData.weight || '',
                goal: userData.goal || '',
            });
        }
    }, [userData]);

    // ⭐ 2. Обробка змін у формі
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ⭐ 3. Обробка відправки форми (Збереження у Firestore)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus('loading');

        try {
            if (!userData || !userData.uid) {
                throw new Error("Не знайдено UID користувача.");
            }

            const userDocRef = doc(db, 'users', userData.uid);
            
            // Оновлюємо документ користувача в колекції 'users'
            await updateDoc(userDocRef, formData);
            
            setUpdateStatus('success');
            setIsEditing(false); 
            setTimeout(() => setUpdateStatus(null), 3000); 
            
        } catch (err) {
            console.error("Помилка оновлення профілю:", err);
            setUpdateStatus('error');
            setTimeout(() => setUpdateStatus(null), 5000);
        }
    };

    if (loadingData) return <div className="profile-container"><p>Завантаження даних профілю...</p></div>;
    if (error) return <div className="profile-container"><p className="status-error">Помилка завантаження: {error}</p></div>;
    if (!userData) return <div className="profile-container"><p>Дані користувача не знайдені.</p></div>;

    return (
        <div className="profile-container">
            <h1 className="page-title">Персональний Профіль</h1>
            
            <form onSubmit={handleSubmit} className="profile-form">
                
                {/* -------------------- БАЗОВІ ДАНІ (Тільки для читання) -------------------- */}
                <div className="form-section">
                    <h2>Обліковий запис</h2>
                    <div className="info-group">
                        <label>Електронна пошта:</label>
                        <p className="info-value">{userData.email || 'Не вказано'}</p>
                    </div>
                </div>

                {/* -------------------- РЕДАГОВАНІ ДАНІ -------------------- */}
                <div className="form-section">
                    <h2>Особиста інформація</h2>
                    
                    {/* ІМ'Я */}
                    <div className="form-group">
                        <label htmlFor="firstName">Ім'я:</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={isEditing ? 'editable' : 'read-only'}
                            placeholder="Ваше ім'я"
                        />
                    </div>
                    
                    {/* ПРІЗВИЩЕ */}
                    <div className="form-group">
                        <label htmlFor="lastName">Прізвище:</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={isEditing ? 'editable' : 'read-only'}
                            placeholder="Ваше прізвище"
                        />
                    </div>
                    
                    {/* ДАТА НАРОДЖЕННЯ */}
                    <div className="form-group">
                        <label htmlFor="birthDate">Дата народження:</label>
                        <input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={isEditing ? 'editable' : 'read-only'}
                        />
                    </div>

                    {/* ЗРІСТ */}
                    <div className="form-group">
                        <label htmlFor="height">Зріст (см):</label>
                        <input
                            id="height"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={isEditing ? 'editable' : 'read-only'}
                            placeholder="Наприклад, 180"
                        />
                    </div>

                    {/* ВАГА */}
                    <div className="form-group">
                        <label htmlFor="weight">Вага (кг):</label>
                        <input
                            id="weight"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={isEditing ? 'editable' : 'read-only'}
                            placeholder="Наприклад, 80"
                        />
                    </div>
                    
                    {/* МЕТА */}
                    <div className="form-group full-width">
                        <label htmlFor="goal">Основна мета:</label>
                        <textarea
                            id="goal"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            className={isEditing ? 'editable' : 'read-only'}
                            placeholder="Ваша спортивна мета або мета покращення здоров'я"
                            rows="3"
                        ></textarea>
                    </div>
                </div>

                {/* -------------------- КНОПКИ ДІЙ -------------------- */}
                <div className="profile-actions">
                    {updateStatus === 'loading' && <p className="status-message loading">Оновлення даних...</p>}
                    {updateStatus === 'success' && <p className="status-message success">Дані успішно оновлено!</p>}
                    {updateStatus === 'error' && <p className="status-message error">Помилка оновлення. Спробуйте ще раз.</p>}

                    {!isEditing ? (
                        <button type="button" onClick={() => setIsEditing(true)} className="edit-button">
                            Редагувати профіль
                        </button>
                    ) : (
                        <>
                            <button 
                                type="submit" 
                                className="save-button" 
                                disabled={updateStatus === 'loading'}
                            >
                                Зберегти зміни
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)} 
                                className="cancel-button"
                            >
                                Скасувати
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Profile;