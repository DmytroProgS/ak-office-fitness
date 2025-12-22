// src/components/WellnessDataTable/WellnessDataTable.js

import React from 'react';
import './WellnessDataTable.css'; 

const WellnessDataTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>Немає записів для відображення в таблиці за обраний період.</p>;
    }

    // ⭐ ВИЗНАЧАЄМО КОЛОНКИ ТА ЇХНІ ЗАГОЛОВКИ
    const columns = [
        { key: 'timestamp', title: 'Дата' },
        { key: 'sleepQuality', title: 'Сон (1-10)' },
        { key: 'stressLevel', title: 'Стрес (1-10)' },
        { key: 'sportLevel', title: 'Спорт (1-10)' },
        { key: 'fatigue', title: 'Втома (1-10)' },
        { key: 'hasPain', title: 'Біль' },
        { key: 'painArea', title: 'Де болить' },
    ];

    // ⭐ ФУНКЦІЯ ФОРМАТУВАННЯ ЗНАЧЕНЬ
    const formatValue = (key, value) => {
        if (key === 'timestamp' && value instanceof Date) {
            // Форматуємо дату у вигляд "день.місяць.рік"
            return value.toLocaleDateString('uk-UA');
        }
        if (Array.isArray(value)) {
            // Об'єднуємо масив зон болю
            return value.join(', ') || 'Ні';
        }
        if (value === true) return 'Так';
        if (value === false) return 'Ні';
        
        return value || '-'; // Якщо значення відсутнє, ставимо прочерк
    };

    return (
        <div className="data-table-wrapper">
            <div className="data-table-scroll">
                <table>
                    {/* -------------------- ЗАГОЛОВКИ ТАБЛИЦІ -------------------- */}
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    {/* -------------------- ТІЛО ТАБЛИЦІ -------------------- */}
                    <tbody>
                        {data.map((record, index) => (
                            <tr key={record.id || index}>
                                {columns.map(col => (
                                    <td key={col.key}>
                                        {formatValue(col.key, record[col.key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WellnessDataTable;