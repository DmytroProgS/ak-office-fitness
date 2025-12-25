import React from 'react';
import { Link } from 'react-router-dom';
import './HomeContent.css';
import mainImage from '../../assets/images/main_image.jpg'; 

const HomeContent = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-text-content">
                    <h1 className="hero-title">
                        PRO <span className="gold-text">ATHLETE</span> CARE
                    </h1>
                    <h2 className="hero-subtitle-main">
                        Онлайн-тренінг та професійний супровід атлетів
                    </h2>
                    <p className="hero-description">
                        Професійна платформа для контролю фізичного стану, 
                        тренувального процесу та відновлення. Отримуйте результат під наглядом експертів.
                    </p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn-primary">Увійти</Link>
                        <Link to="/register" className="btn-secondary">Реєстрація</Link>
                    </div>
                </div>
                
                <div className="hero-image-wrapper">
                    <img src={mainImage} alt="Professional Athlete" className="hero-athlete-img" />
                    <div className="image-gradient-overlay"></div>
                </div>
            </section>
        </div>
    );
};

export default HomeContent;