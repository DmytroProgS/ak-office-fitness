// src/pages/WellnessControl/WellnessControl.js
import React, { useState } from 'react';
import './WellnessControl.css'; 

const WellnessControl = () => {
    const [formData, setFormData] = useState({
        // Контактні дані
        firstName: '',           
        lastName: '',            
        email: '',               
        
        // Дані опитувальника (шкала 1-10)
        sleepQuality: 5,         
        sportLevel: 5,           
        stressLevel: 5,          
        officeExercises: 5,      
        
        // Біль/дискомфорт
        hasPain: 'Ні',           
        painArea: [],            
        painDescription: '',     
    });

    // Список можливих зон болю
    const painAreas = ['Шия', 'Плече', 'Верхня частина спини', 'Поперековий відділ хребта / нижня частина спини', 'Сідниці', 'Ноги', 'Стопи/гомілкостоп', 'Голова', 'Руки'];


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Обробка множинного вибору (зони болю)
            const newPainArea = checked
                ? [...formData.painArea, value]
                : formData.painArea.filter((area) => area !== value);
            
            setFormData({ ...formData, painArea: newPainArea });
            return;
        }

        setFormData({
            ...formData,
            [name]: name === 'sleepQuality' || name === 'sportLevel' || name === 'stressLevel' || name === 'officeExercises'
                ? parseInt(value)
                : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Мінімальна перевірка
        if (!formData.firstName || !formData.email) {
            alert("Будь ласка, введіть Ім'я та Пошту.");
            return;
        }

        // Тимчасово виводимо дані у консоль
        console.log("Дані опитувальника:", formData);
        alert("Дані збережено! Перевірте консоль для деталізації. (Налаштування відправки email буде наступним кроком).");
        
        // Тут буде реальна логіка відправки на вашу пошту (пізніше)
    };
    
    // Компонент для слайдерів (зміна назви, щоб відображати зірочки)
    const StarRatingSlider = ({ name, label }) => (
        <div className="form-group">
            <label htmlFor={name}>
                {label}: 
                <span className="rating-value">{formData[name]}</span> / 10
            </label>
            <input
                type="range"
                id={name}
                name={name}
                min="1"
                max="10"
                value={formData[name]}
                onChange={handleChange}
                className="slider"
            />
        </div>
    );

    return (
        <div className="wellness-container">
            <h1>ЩОДЕННІ ПИТАННЯ (Wellness Control)</h1>
            <p>Будь ласка, заповніть форму для контролю вашого самопочуття.</p>
            
            <form onSubmit={handleSubmit} className="wellness-form">
                
                {/* -------------------- КОНТАКТНІ ДАНІ -------------------- */}
                <div className="contact-group">
                    <div className="form-group half-width">
                        <label htmlFor="firstName">Ім'я:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group half-width">
                        <label htmlFor="lastName">Прізвище:</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email (для відповіді):</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" required />
                </div>
                
                <hr className="divider" />

                {/* -------------------- ПИТАННЯ (ШКАЛА) -------------------- */}
                <StarRatingSlider name="sleepQuality" label="Як ти спав минулої ночі? (1-10)" />
                <StarRatingSlider name="sportLevel" label="Який у вас сьогодні рівень спорту? (1-10)" />
                <StarRatingSlider name="stressLevel" label="Який у вас сьогодні рівень стресу? (1-10)" />
                <StarRatingSlider name="officeExercises" label="Ви виконали сьогодні рекомендовані офісні вправи? (1-10)" />
                
                <hr className="divider" />

                {/* -------------------- БІЛЬ/ДИСКОМФОРТ -------------------- */}
                <div className="form-group">
                    <label>Чи відчуваєте ви зараз якийсь біль або дискомфорт у своєму тілі?</label>
                    <div className="radio-group">
                        <label>
                            <input type="radio" name="hasPain" value="Так" checked={formData.hasPain === 'Так'} onChange={handleChange} /> Так
                        </label>
                        <label>
                            <input type="radio" name="hasPain" value="Ні" checked={formData.hasPain === 'Ні'} onChange={handleChange} /> Ні
                        </label>
                    </div>
                </div>

                {formData.hasPain === 'Так' && (
                    <>
                        <div className="form-group checkbox-group">
                            <label>Якщо так, то де саме? (Можливий вибір кількох варіантів)</label>
                            {painAreas.map((area) => (
                                <label key={area} className="checkbox-item">
                                    <input 
                                        type="checkbox" 
                                        name="painArea" 
                                        value={area} 
                                        checked={formData.painArea.includes(area)} 
                                        onChange={handleChange} 
                                    /> 
                                    {area}
                                </label>
                            ))}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="painDescription">Додатковий опис болю:</label>
                            <textarea
                                id="painDescription"
                                name="painDescription"
                                value={formData.painDescription}
                                onChange={handleChange}
                                placeholder="Опишіть, як ви себе почуваєте або де саме відчуваєте біль."
                                rows="3"
                            ></textarea>
                        </div>
                    </>
                )}

                <button type="submit" className="submit-button">Зберегти та надіслати опитувальник</button>
            </form>
        </div>
    );
};

export default WellnessControl;