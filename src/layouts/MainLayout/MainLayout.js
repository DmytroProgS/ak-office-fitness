// src/layouts/MainLayout/MainLayout.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

import './MainLayout.css'; // <-- Імпорт вашого CSS файлу

const MainLayout = ({ children }) => {
    // Отримуємо поточний стан користувача
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    // 1. ФУНКЦІЯ ВИХОДУ (Logout)
    const handleLogout = async () => {
        try {
            await signOut(auth); // Метод Firebase для виходу
            // Після виходу ProtectedRoute перенаправить користувача на /login
            navigate('/login'); 
            alert("Ви успішно вийшли з акаунту.");
        } catch (error) {
            console.error("Помилка при виході:", error);
            alert("Помилка при виході з акаунту.");
        }
    };

    // 2. КОМПОНЕНТ НАВІГАЦІЇ
    const Navigation = () => {
        if (loading) {
            return <div className="nav-loading">Завантаження...</div>;
        }

        return (
            <nav className="main-nav">
                <Link to="/" className="nav-link">Головна</Link>
                
                {user ? (
                    // ЯКЩО КОРИСТУВАЧ УВІЙШОВ
                    <>
                        {/* Посилання на захищені сторінки */}
                        <Link to="/wellness" className="nav-link">Wellness</Link> 
                        {/* КНОПКА ВИХОДУ: викликає handleLogout */}
                        <span onClick={handleLogout} className="nav-link logout-link">
                            Вихід
                        </span>
                    </>
                ) : (
                    // ЯКЩО КОРИСТУВАЧ НЕ УВІЙШОВ
                    <>
                        <Link to="/login" className="nav-link">Вхід</Link>
                        <Link to="/register" className="nav-link">Реєстрація</Link>
                    </>
                )}
            </nav>
        );
    };

    // 3. РЕНДЕРИНГ МАКЕТА
    return (
        <div className="main-layout-container">
            <header className="main-header">
                <h2 className="site-title">AK Office Fitness</h2>
                <Navigation /> {/* Вставляємо навігацію */}
            </header>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;