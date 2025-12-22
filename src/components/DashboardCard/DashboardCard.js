// src/components/DashboardCard/DashboardCard.js

import React from 'react';
import './DashboardCard.css'; // Імпортуємо стилі

// title, value, unit, description, icon - це дані з lastRecord
// color - використовується для підсвічування картки (наприклад, success, danger, primary)
const DashboardCard = ({ title, value, unit, description, icon, color = 'var(--primary-color)' }) => {
    return (
        // Встановлюємо border-left-color відповідно до переданого кольору
        <div className="dashboard-card" style={{ borderLeftColor: color }}>
            <div className="card-header">
                {/* Іконка з кольором */}
                <span className="card-icon" style={{ color: color }}>
                    {icon} 
                </span>
                <h3 className="card-title">{title}</h3>
            </div>
            
            <div className="card-body">
                <div className="card-value-group">
                    <span className="card-value">{value}</span>
                    {unit && <span className="card-unit">{unit}</span>}
                </div>
                <p className="card-description">{description}</p>
            </div>
        </div>
    );
};

export default DashboardCard;