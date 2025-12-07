// src/layouts/MainLayout/MainLayout.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import useUserData from '../../hooks/useUserData'; 

import './MainLayout.css'; 

// ПОСИЛАННЯ ДЛЯ ЛІВОГО VERTICAL SIDEBAR
const sidebarMenuLinks = [
    { title: "Wellness Control", path: "/wellness" },
    { title: "Injury Story", path: "/injury" },
    { title: "Load Season", path: "/load" },
    { title: "Daily Individual", path: "/daily" },
    { title: "Weekly Individual", path: "/weekly" },
    { title: "Weight Control", path: "/weight" },
    { title: "Velocity Control", path: "/velocity" },
];

const MainLayout = ({ children }) => {
    // 1. Автентифікація та її статус
    const [user, loadingAuth] = useAuthState(auth); 
    
    // 2. Дані користувача та статус їх завантаження
    const { userData, loading: loadingData } = useUserData();
    
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); 
        } catch (error) {
            console.error("Помилка при виході:", error);
        }
    };

    // Визначаємо ім'я для відображення
    const displayName = userData 
        ? userData.firstName || 'Користувач' 
        : (user && user.email) 
        ? user.email.split('@')[0] 
        : 'Користувач';


    // Компонент, який відображається у верхньому хедері
    const HeaderContent = () => {
        // У цьому компоненті ми НЕ БЛОКУЄМО відображення через loadingAuth!
        
        return (
            <nav className="main-nav">
                <Link to="/" className="nav-link">Головна</Link>
                
                {user ? (
                    <>
                        {/* Показати ім'я, використовуючи displayName */}
                        <span className="nav-link profile-link">
                            {user && !loadingData ? displayName : 'Профіль...'} 
                        </span>
                        <span onClick={handleLogout} className="nav-link logout-link">
                            Вихід
                        </span>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Вхід</Link>
                        <Link to="/register" className="nav-link">Реєстрація</Link>
                    </>
                )}
            </nav>
        );
    };

    // Бічне меню відображається, лише якщо користувач увійшов І автентифікація завершена.
    // Тут ми УСУВАЄМО залежність від loadingData!
    const shouldShowSidebar = user && !loadingAuth;

    // *** КРИТИЧНЕ ПОКРАЩЕННЯ UX: Раннє повернення при завантаженні автентифікації ***
    // Показуємо мінімальну заглушку на 500-800 мс, щоб не відображати "битий" інтерфейс
    if (loadingAuth) {
        return (
            <div className="main-layout-container">
                <header className="main-header">
                    <h2 className="site-title">AK Office Fitness</h2>
                    <div className="nav-loading">Завантаження сесії...</div>
                </header>
                <div className="page-content-wrapper no-sidebar" style={{textAlign: 'center', marginTop: '100px'}}>
                    <p>Ініціалізація додатка. Будь ласка, зачекайте...</p>
                </div>
            </div>
        );
    }
    // *******************************************************************************

    return (
        <div className="main-layout-container">
            <header className="main-header">
                <h2 className="site-title">AK Office Fitness</h2>
                <HeaderContent /> 
            </header>
            
            {/* 1. ЛІВА БІЧНА ПАНЕЛЬ - Винесена для фіксованого позиціонування */}
            {shouldShowSidebar && (
                <aside className="left-sidebar">
                    
                    {/* Картка користувача */}
                    <div className="user-profile-card">
                        <div className="user-avatar-placeholder">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <p className="user-name">{displayName}</p> 
                        <p className="user-email">{user.email}</p> 
                    </div>
                    
                    {/* Вертикальне меню з Wellness розділів */}
                    <div className="sidebar-menu">
                        {sidebarMenuLinks.map((section, index) => (
                            <Link to={section.path} key={index} className="sidebar-menu-link">
                                {section.title}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Логотип-заглушка */}
                    <div className="sidebar-logo-placeholder">
                        [Placeholder Image]
                    </div>
                </aside>
            )}
            
            {/* 2. ОСНОВНА ОБГОРТКА КОНТЕНТУ */}
            <div className={`page-content-wrapper ${shouldShowSidebar ? 'sidebar-visible' : 'no-sidebar'}`}>
                 <main className="main-content">
                    {children}
                </main>
            </div>
            
        </div>
    );
};

export default MainLayout;