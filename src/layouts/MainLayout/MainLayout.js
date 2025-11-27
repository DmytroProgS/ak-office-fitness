// src/layouts/MainLayout/MainLayout.js

import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar'; 
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { auth } from '../../firebase'; // <-- ВИПРАВЛЕНО! (Два '../' достатньо)
import { signOut } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom'; 

import './MainLayout.css'; 

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth); 

    // Функція виходу з системи
    const logout = () => {
        signOut(auth)
            .then(() => {
                navigate('/login');
                console.log("Користувач вийшов з системи");
            })
            .catch((error) => {
                console.error("Помилка при виході:", error);
                alert("Помилка при виході!");
            });
    };
    
    // Передаємо стан користувача, функцію виходу та навігацію до Sidebar
    return (
        <div className="layout-container">
            {/* 1. Ліва частина: Бічна панель навігації */}
            <Sidebar 
                user={user} 
                loading={loading} 
                logout={logout} 
                navigate={navigate} 
            />
            
            {/* 2. Права частина: Основний контент (передається як 'children') */}
            <main className="content-area">
                {children} 
            </main>
        </div>
    );
};

export default MainLayout;