import React from 'react';
import { Link } from 'react-router-dom';
import '../Register/Register.css'; // Використовуємо ті ж стилі

const HomeContent = () => {
    return (
        <div className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <h1>Ласкаво просимо!</h1>
                <p style={{ color: '#ccc', marginBottom: '30px' }}>
                    Оберіть дію, щоб розпочати роботу з AK-Office-Fitness
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link to="/login" className="auth-button" style={{ textDecoration: 'none' }}>
                        Увійти в систему
                    </Link>
                    <Link to="/register" className="auth-button" style={{ 
                        textDecoration: 'none', 
                        background: 'transparent', 
                        border: '2px solid #f7d540', 
                        color: '#f7d540' 
                    }}>
                        Нова реєстрація
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeContent;