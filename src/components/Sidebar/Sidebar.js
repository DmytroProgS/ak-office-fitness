import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import menuIcon from '../../assets/images/AK_logo.png'; // Логотип для іконок

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/wellness', label: 'Wellness Control' },
        { path: '/injury', label: 'Injury Story' },
        { path: '/load', label: 'Load Season' },
        { path: '/daily', label: 'Щоденна індивідуальна' },
        { path: '/weekly', label: 'Щотижнева індивідуальна' },
        { path: '/weight', label: 'Контроль ваги' },
        { path: '/training', label: 'Щоденник тренувань' },
        { path: '/velocity', label: 'Контроль швидкості' }
    ];

    return (
        <nav className="sidebar">
            <div className="sidebar-links">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className={isActive(item.path) ? 'active' : ''}
                    >
                        {item.label}
                        <img src={menuIcon} className="menu-icon" alt="АК" />
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Sidebar;