// src/pages/Reports/Reports.js

import React, { useState } from 'react';
// Припускаємо, що ці хуки та компоненти у вас створені:
import useWellnessRecordsHistory from '../../hooks/useWellnessRecordsHistory';
import WellnessChart from '../../components/WellnessChart/WellnessChart';
// ⭐ НОВИЙ ІМПОРТ: КОМПОНЕНТ ДЛЯ ДЕТАЛЬНОЇ ТАБЛИЦІ
import WellnessDataTable from '../../components/WellnessDataTable/WellnessDataTable'; 

import './Reports.css'; 

// Показники, які ми хочемо відобразити на графіках
const metrics = [
    { key: 'sleepQuality', title: 'Якість сну (1-10)', color: 'var(--success-color)' },
    { key: 'sportLevel', title: 'Рівень спорту (1-10)', color: 'var(--primary-color)' },
    { key: 'stressLevel', title: 'Рівень стресу (1-10)', color: 'var(--danger-color)' },
    { key: 'officeExercises', title: 'Офісні вправи (1-10)', color: 'var(--warning-color)' },
];

const Reports = () => {
    // Стан для вибору періоду (за замовчуванням 30 днів)
    const [period, setPeriod] = useState(30); 
    
    // Завантажуємо історію записів
    const { history, loading, error } = useWellnessRecordsHistory(period);
    
    const handlePeriodChange = (e) => {
        setPeriod(Number(e.target.value));
    };

    return (
        <div className="reports-container">
            <h1 className="page-title">Звітність та Аналітика</h1>
            
            <div className="reports-controls">
                <label htmlFor="period-select" className="period-label">
                    Період звітності:
                </label>
                <select 
                    id="period-select" 
                    value={period} 
                    onChange={handlePeriodChange}
                    className="period-select"
                >
                    <option value={7}>Останні 7 днів</option>
                    <option value={30}>Останні 30 днів</option>
                    <option value={90}>Останні 90 днів</option>
                    <option value={180}>Останні 180 днів</option>
                </select>
            </div>

            {loading && <p className="status-message">Завантаження історії показників...</p>}
            {error && <p className="status-message status-error">Помилка завантаження даних: {error}</p>}
            
            {history.length === 0 && !loading && (
                <p className="status-message status-info">
                    Немає даних за обраний період ({period} днів). Будь ласка, заповніть Велнес-контроль.
                </p>
            )}

            <div className="charts-grid">
                {/* Відображаємо графіки, якщо є дані */}
                {history.length > 0 && metrics.map(metric => (
                    <div className="chart-wrapper" key={metric.key}>
                        <WellnessChart 
                            data={history} 
                            dataKey={metric.key} 
                            title={metric.title} 
                            lineColor={metric.color}
                        />
                    </div>
                ))}
            </div>

            {history.length > 0 && (
                <div className="data-table-section">
                    <h2>Детальна Таблиця Даних</h2>
                    {/* ⭐ ЗАМІСТЬ ЗАГЛУШКИ ТЕПЕР ФАКТИЧНИЙ КОМПОНЕНТ ТАБЛИЦІ */}
                    <WellnessDataTable data={history} />
                </div>
            )}
            
        </div>
    );
};

export default Reports;