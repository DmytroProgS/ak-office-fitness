// src/components/InjuryForm/InjuryForm.js

import React, { useState } from 'react';
import useInjuryRecords from '../../hooks/useInjuryRecords'; // Імпортуємо наш хук
import './InjuryForm.css';

// Можливі зони травм для вибору
const injuryAreas = [
    'Голова/Шия', 'Плече', 'Лікоть', 'Кисть', 
    'Спина (верх)', 'Спина (низ)', 'Стегно', 
    'Коліно', 'Гомілка', 'Стопа', 'Інше'
];

const InjuryForm = () => {
    const { addInjury } = useInjuryRecords();
    const [formData, setFormData] = useState({
        injuryName: '',
        area: '',
        description: '',
        startDate: new Date().toISOString().substring(0, 10), // Формат YYYY-MM-DD
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setLoading(true);

        try {
            // Конвертуємо рядок дати в об'єкт Date для зберігання у Firebase
            const injuryDate = new Date(formData.startDate);
            
            await addInjury({
                injuryName: formData.injuryName,
                area: formData.area,
                description: formData.description,
                startDate: injuryDate, 
            });

            setMessage('✅ Запис про травму успішно додано!');
            // Очищення форми після успішного додавання
            setFormData({
                injuryName: '',
                area: '',
                description: '',
                startDate: new Date().toISOString().substring(0, 10),
            });
        } catch (error) {
            console.error("Помилка:", error);
            setMessage(`❌ Помилка: ${error.message}`);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="injury-form-container">
            <h2>Додати Нову Травму</h2>
            <form onSubmit={handleSubmit}>
                
                {/* 1. Назва Травми */}
                <div className="form-group">
                    <label htmlFor="injuryName">Коротка назва травми (наприклад, "Розтягнення гомілкостопа")</label>
                    <input
                        type="text"
                        id="injuryName"
                        name="injuryName"
                        value={formData.injuryName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 2. Локалізація Травми */}
                <div className="form-group">
                    <label htmlFor="area">Локалізація (Зона тіла)</label>
                    <select
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Оберіть зону</option>
                        {injuryAreas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                </div>

                {/* 3. Дата Початку */}
                <div className="form-group">
                    <label htmlFor="startDate">Дата початку травми</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* 4. Опис */}
                <div className="form-group">
                    <label htmlFor="description">Детальний опис та обставини</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>

                {/* Повідомлення про статус */}
                {message && (
                    <p className={`form-message ${isError ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Збереження...' : 'Записати Травму'}
                </button>
            </form>
        </div>
    );
};

export default InjuryForm;