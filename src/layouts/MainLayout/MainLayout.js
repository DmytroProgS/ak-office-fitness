import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar'; // Шлях до вашого Sidebar
import './MainLayout.css'; // Створимо цей файл пізніше для стилізації

const MainLayout = ({ children }) => {
    return (
        <div className="layout-container">
            {/* 1. Ліва частина: Бічна панель навігації */}
            <Sidebar />

            {/* 2. Права частина: Основний контент (передається як 'children') */}
            <main className="content-area">
                {children} 
            </main>
        </div>
    );
};

export default MainLayout;