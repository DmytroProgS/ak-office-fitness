// src/pages/InjuryStory/InjuryStory.js (Приклад)

import React from 'react';
import './LoadSeason.css'; // Необов'язково, але бажано

const LoadSeason = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">Load Season: Контроль тренувального навантаження</h1>
            <p className="page-status-message">
                Цей розділ знаходиться в розробці. Тут буде реалізовано відстеження травм та відновлення.
            </p>
        </div>
    );
};

export default LoadSeason;