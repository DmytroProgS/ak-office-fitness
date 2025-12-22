// src/components/Sidebar/Sidebar.js

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '../../firebase'; 
import './Sidebar.css'; 

const Sidebar = ({ userName }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path || (path === '/dashboard' && location.pathname === '/');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); 
        } catch (error) {
            console.error("Помилка при виході:", error);
            alert("Не вдалося вийти. Спробуйте ще раз.");
        }
    };

    return (
        <div className="sidebar">
            <div className="logo-section">
                <span className="logo-text">Pro Athlete Care</span>
            </div>
            
            <nav className="nav-menu">
                <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <i className="icon-dashboard"></i> Панель управління
                </Link>
                
                <Link to="/wellness" className={`nav-item ${isActive('/wellness') ? 'active' : ''}`}>
                    <i className="icon-wellness"></i> Велнес-контроль
                </Link>

                <Link to="/reports" className={`nav-item ${isActive('/reports') ? 'active' : ''}`}>
                    <i className="icon-reports"></i> Звітність
                </Link>

                <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                    <i className="icon-profile"></i> Профіль
                </Link>
                
                <Link to="/injury" className={`nav-item ${isActive('/injury') ? 'active' : ''}`}>
                    <i className="icon-injury"></i> Історія травм
                </Link>

                <Link to="/load" className={`nav-item ${isActive('/load') ? 'active' : ''}`}>
                    <i className="icon-load"></i> Сезонне навантаження
                </Link>
                
                <Link to="/daily" className={`nav-item ${isActive('/daily') ? 'active' : ''}`}>
                    <i className="icon-daily"></i> Щоденна індивідуальна
                </Link>

                <Link to="/weekly" className={`nav-item ${isActive('/weekly') ? 'active' : ''}`}>
                    <i className="icon-weekly"></i> Щотижнева індивідуальна
                </Link>
                
                <Link to="/weight" className={`nav-item ${isActive('/weight') ? 'active' : ''}`}>
                    <i className="icon-weight"></i> Контроль ваги
                </Link>

                {/* ⭐ НОВИЙ ПУНКТ: ЩОДЕННИК ТРЕНУВАНЬ */}
                <Link to="/training" className={`nav-item ${isActive('/training') ? 'active' : ''}`}>
                    <i className="icon-training"></i> Щоденник тренувань
                </Link>
                
                <Link to="/velocity" className={`nav-item ${isActive('/velocity') ? 'active' : ''}`}>
                    <i className="icon-velocity"></i> Контроль швидкості
                </Link>
                
            </nav>

            <div className="user-section">
                <p className="user-name">Привіт, {userName || 'Користувач'}!</p>
                <button className="logout-btn" onClick={handleLogout}>
                    Вийти
                </button>
            </div>
        </div>
    );
};

export default Sidebar;