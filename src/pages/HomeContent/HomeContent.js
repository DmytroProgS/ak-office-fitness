// src/pages/HomeContent/HomeContent.js

import React from 'react';
import './HomeContent.css'; // Імпортуємо зовнішній файл стилів
import MainHeroImage from '../../assets/main_hero_image.png'; // Перевірте, чи правильний шлях!

const HomeContent = () => (
    // Використовуємо класи замість inline styles
    <div className="home-content-container"> 
        <h1>Ласкаво просимо до AK-Office-Fitness!</h1>
        <p>Оберіть розділ у бічному меню.</p>
        
        <img 
            src={MainHeroImage} 
            alt="Футболіст" 
            className="home-hero-image" // Клас для стилізації зображення
        />
    </div>
);

export default HomeContent;



