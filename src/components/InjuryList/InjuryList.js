// src/components/InjuryList/InjuryList.js

import React from 'react';
import './InjuryList.css'; 

const InjuryList = ({ history }) => {
    if (history.length === 0) {
        return <p className="no-records-message">Наразі немає зареєстрованих травм.</p>;
    }

    const formatDate = (date) => {
        if (!date) return '-';
        // Форматування дати у вигляд ДД.ММ.РРРР
        return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Візуальний клас для статусу
    const getStatusClass = (status) => {
        switch (status) {
            case 'активна':
                return 'status-active';
            case 'відновлення':
                return 'status-recovery';
            case 'завершена':
                return 'status-resolved';
            default:
                return '';
        }
    };

    return (
        <div className="injury-list-container">
            <h3>Історія Зареєстрованих Травм ({history.length})</h3>
            
            <div className="injury-cards-grid">
                {history.map(injury => (
                    <div key={injury.id} className="injury-card">
                        <div className="card-header-status">
                            <h4 className="injury-name">{injury.injuryName}</h4>
                            <span className={`injury-status ${getStatusClass(injury.status)}`}>
                                {injury.status.toUpperCase()}
                            </span>
                        </div>
                        
                        <p className="injury-area">
                            <strong>Зона:</strong> {injury.area}
                        </p>
                        
                        <p className="injury-dates">
                            <strong>Дата початку:</strong> {formatDate(injury.startDate)}
                        </p>
                        
                        <p className="injury-description">
                            {injury.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InjuryList;