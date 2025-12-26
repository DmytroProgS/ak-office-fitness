import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1 className="about-title">Про <span className="gold-text">проєкт</span></h1>
                <div className="about-text-block">
                    <p>
                        <strong>PRO ATHLETE CARE</strong> — це професійна екосистема для спортсменів, 
                        створена для оптимізації тренувального процесу, моніторингу стану здоров'я 
                        та досягнення пікових результатів.
                    </p>
                    <p>
                        Наш проєкт забезпечує онлайн-тренінг та повний професійний супровід атлетів, 
                        поєднуючи сучасні методики реабілітації та фізичної підготовки.
                    </p>
                    <p className="placeholder-text">
                        [Тут згодом буде детальніший опис вашої місії, команди та методології]
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;