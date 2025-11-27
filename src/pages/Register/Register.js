// src/pages/Register/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase'; // Імпортуємо наш auth об'єкт

// Ми будемо використовувати спільні стилі з Wellness, тому додамо їх пізніше
// import './Register.css'; 

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName) {
            alert("Будь ласка, введіть Ім'я та Прізвище");
            return;
        }

        try {
            // Створення користувача в Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Успішна реєстрація:", userCredential.user);
            
            // Тут у майбутньому ми будемо зберігати додаткові дані (ПІБ) у Firestore
            
            alert("Реєстрація успішна! Ви можете увійти.");
            navigate('/login'); // Перенаправлення на сторінку входу
        } catch (error) {
            console.error("Помилка реєстрації:", error.message);
            alert(`Помилка реєстрації: ${error.message}`);
        }
    };

    return (
        <div className="wellness-container">
            <h1>Реєстрація користувача</h1>
            <form onSubmit={register} className="wellness-form">
                
                <div className="contact-group">
                    <div className="form-group half-width">
                        <label htmlFor="firstName">Ім'я:</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="form-group half-width">
                        <label htmlFor="lastName">Прізвище:</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                <button type="submit" className="submit-button">Зареєструватися</button>
                <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
                    Вже маєте акаунт? <a href="/login" style={{ color: '#f7d540', textDecoration: 'none' }}>Увійти</a>
                </p>
            </form>
        </div>
    );
};

export default Register;