// src/layouts/MainLayout/MainLayout.js
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import useUserData from '../../hooks/useUserData'; 

// Імпортуємо компонент сайдбару
import Sidebar from '../../components/Sidebar/Sidebar'; 

// Імпортуємо CSS
import './MainLayout.css'; 

const MainLayout = ({ children }) => {
    // 1. Стан авторизації (Firebase Auth)
    const [user, loadingAuth] = useAuthState(auth); 
    
    // 2. Дані профілю (Firestore)
    const { userData, loading: loadingData } = useUserData();
    
    // Визначаємо, чи потрібно відображати сайдбар
    const isUserLoggedIn = user && !loadingAuth;
    
    // 🛑 ОБРОБКА ЗАВАНТАЖЕННЯ
    // Якщо Auth ще вантажиться АБО якщо користувач є, але його дані (ім'я) ще не підтягнулися з бази
    if (loadingAuth || (user && loadingData)) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div> 
                <p>Завантаження профілю...</p>
            </div>
        );
    }

    // Якщо користувач не залогінений (сторінки Login/Register) - показуємо контент без сайдбару
    if (!isUserLoggedIn) {
        return <>{children}</>; 
    }
    
    // Формуємо ім'я для сайдбару (пріоритет на Ім'я, потім на частину Email)
    const userName = userData?.firstName || userData?.email?.split('@')[0] || 'Спортсмен';

    return (
        <div className="dashboard-layout">
            {/* Ліва панель навігації */}
            <Sidebar userName={userName} />
            
            {/* Основний контент сторінки */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;