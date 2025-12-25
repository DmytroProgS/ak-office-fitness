import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Панель управління' },
        { path: '/wellness', label: 'Велнес-контроль' },
        { path: '/injury', label: 'Історія травм' },
        { path: '/training', label: 'Щоденник тренувань' },
        { path: '/weight', label: 'Контроль ваги' }
    ];

    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                {navItems.map(item => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;