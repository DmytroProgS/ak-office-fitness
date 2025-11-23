import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Створимо цей файл пізніше для стилізації

import AkLogo from '../../assets/ak_logo.png'; 

const Sidebar = () => {
    // Список ваших розділів та відповідних маршрутів (URL-шляхів)
    const navItems = [
        { name: "WELLNESS CONTROL", path: "/wellness" },
        { name: "INJURY STORY", path: "/injury" },
        { name: "LOAD SEASON", path: "/load" },
        { name: "DAILY INDIVIDUAL", path: "/daily" },
        { name: "WEEKLY INDIVIDUAL", path: "/weekly" },
        { name: "WEIGHT CONTROL", path: "/weight" },
        { name: "VELOCITY CONTROL", path: "/velocity" }
    ];

    return (
        <div className="sidebar">
          <Link to="/" className="logo-section-link"> 
                <div className="logo-section">
                    {/* ========================================================= */}
                    {/* ЗМІНИ ТУТ: Замінюємо <h1>AK</h1> на тег <img> */}
                    <img src={AkLogo} alt="AK Logo" className="ak-logo-image" />
                    {/* ========================================================= */}
                </div>
            </Link>

            <nav>
                {navItems.map((item) => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        className="sidebar-link"
                    >
                        {/* Логотип 'AK' поруч із назвою, як на зображенні */}
                        <span>{item.name}</span>
                        <span className="link-icon">AK</span> 
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;