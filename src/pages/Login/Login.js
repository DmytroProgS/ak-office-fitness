// src/pages/Login/Login.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth'; // Для перевірки стану входу

// Будемо використовувати спільні стилі з Wellness/Register
// import './Login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading] = useAuthState(auth); // Отримуємо стан користувача
    const navigate = useNavigate();

    // Перевірка, чи користувач вже увійшов
    useEffect(() => {
        if (loading) {
            // Можна показати спінер завантаження
            return; 
        }
        if (user) {
            // Якщо користувач увійшов, перенаправляємо на дашборд (поки що на головну)
            navigate('/');
        }
    }, [user, loading, navigate]);

    const login = async (e) => {
        e.preventDefault();

        try {
            // Вхід користувача в Firebase Authentication
            await signInWithEmailAndPassword(auth, email, password);
            // Успішний вхід буде оброблений useEffect
        } catch (error) {
            console.error("Помилка входу:", error.message);
            alert(`Помилка входу: ${error.message}`);
        }
    };

    return (
        <div className="wellness-container">
            <h1>Вхід в Особистий Кабінет</h1>
            <form onSubmit={login} className="wellness-form">
                
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                <button type="submit" className="submit-button">Увійти</button>
                
                <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
                    Не маєте акаунту? <a href="/register" style={{ color: '#f7d540', textDecoration: 'none' }}>Зареєструватися</a>
                </p>
            </form>
        </div>
    );
};

export default Login;