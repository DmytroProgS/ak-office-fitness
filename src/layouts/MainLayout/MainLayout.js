// src/layouts/MainLayout/MainLayout.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import useUserData from '../../hooks/useUserData'; // <-- Хук для отримання імені

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
    // 1. Автентифікація
    const [user, loadingAuth] = useAuthState(auth); 
    
    // 2. Дані користувача з Firestore
    const { userData, loading: loadingData } = useUserData(); // <-- ВИКЛИК ХУКА
    
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); 
            alert("Ви успішно вийшли з акаунту.");
        } catch (error) {
            console.error("Помилка при виході:", error);
            alert("Помилка при виході з акаунту.");
        }
    };

    // Визначаємо ім'я для відображення: firstName, якщо є, інакше Email або "Користувач"
    const displayName = userData 
        ? userData.firstName || 'Користувач' 
        : (user && user.email) 
        ? user.email.split('@')[0] 
        : 'Користувач';


    const Navigation = () => {
        // Завантаження: або автентифікація, або дані
        if (loadingAuth || loadingData) { return <div className="nav-loading">Завантаження...</div>; }

        return (
            <nav className="main-nav">
                <Link to="/" className="nav-link">Головна</Link>
                
                {user ? (
                    <>
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

    // Sidebar відображається, якщо користувач увійшов І всі дані завантажені
    const shouldShowSidebar = user && !loadingAuth && !loadingData;

    return (
        <div className="main-layout-container">
            <header className="main-header">
                <h2 className="site-title">AK Office Fitness</h2>
                <Navigation />
            </header>
            
            <div className={`content-and-sidebar-wrapper ${shouldShowSidebar ? 'sidebar-visible' : 'no-sidebar'}`}>
                
                {/* 1. ЛІВА БІЧНА ПАНЕЛЬ */}
                {shouldShowSidebar && (
                    <aside className="left-sidebar">
                        
                        {/* Картка користувача */}
                        <div className="user-profile-card">
                            <div className="user-avatar-placeholder">
                                {/* Перша літера імені */}
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            {/* ВИКОРИСТОВУЄМО СПРАВЖНЄ ІМ'Я */}
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
                
                {/* 2. Основний вміст */}
                <main className="main-content">
                    {children}
                </main>
                
            </div>
        </div>
    );
};

export default MainLayout;