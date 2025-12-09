import React, { useState } from 'react';
import emailjs from '@emailjs/browser'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import useUserData from '../../hooks/useUserData'; 
import { db } from '../../firebase'; 

import './WellnessControl.css'; 

// !!! ВАШІ РЕАЛЬНІ КЛЮЧІ EMAILJS !!!
const EMAILJS_SERVICE_ID = 'service_m3w0lih';   
const EMAILJS_TEMPLATE_ID = 'template_6cig964'; 
const EMAILJS_PUBLIC_KEY = 'h4ZitYEvI_2ynZzgm'; 
const RECIPIENT_EMAIL = 'akkfitness13@gmail.com'; 
// ------------------------------------

// ⭐ ІНІЦІАЛІЗАЦІЯ EMAILJS
emailjs.init(EMAILJS_PUBLIC_KEY);

const WellnessControl = () => {
    // Отримуємо дані користувача та статус завантаження
    const { userData, loading: loadingData } = useUserData();

    const [formData, setFormData] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ⭐ КРИТИЧНИЙ ЗАХИСТ: Блокуємо відправку, якщо дані користувача не завантажено
        if (loadingData || !userData || !userData.email || !userData.uid) {
            alert("Будь ласка, дочекайтесь завантаження даних користувача або увійдіть знову.");
            return;
        }
        
        // --- Створення параметрів для EmailJS ---
        const templateParams = {
            to_email: RECIPIENT_EMAIL, 
            
            // ВИПРАВЛЕННЯ: Додано ?? '' для безпеки EmailJS від TypeError: Cannot read properties of undefined (reading 'indexOf')
            from_name: userData.firstName || userData.email?.split('@')[0] || 'Anonymous', 
            from_email: userData.email ?? '', // ГАРАНТУЄМО, ЩО ЦЕ БУДЕ РЯДОК
            
            // Дані опитувальника
            sleep_quality: formData.sleepQuality,
            sport_level: formData.sportLevel,
            stress_level: formData.stressLevel,
            office_exercises: formData.officeExercises,
            
            // Біль/дискомфорт
            has_pain: formData.hasPain,
            pain_area: formData.hasPain === 'Так' && formData.painArea.length > 0 ? formData.painArea.join(', ') : 'Немає',
            pain_description: formData.painDescription || 'Немає додаткового опису.',
            
            timestamp: new Date().toLocaleString('uk-UA'),
        };

        // 1. Створення об'єкта запису для Firestore
        const wellnessRecord = {
            ...formData, 
            userId: userData.uid,
            timestamp: serverTimestamp(), 
            userName: userData.firstName || userData.email, 
        };

        try {
            // 2. ЗБЕРЕЖЕННЯ ДАНИХ У СУБКОЛЕКЦІЮ FIREBASE
            const recordsCollectionRef = collection(db, 'users', userData.uid, 'wellnessRecords');
            await addDoc(recordsCollectionRef, wellnessRecord);

            // 3. ВІДПРАВКА EMAIL
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );
            
            alert(`✅ Опитувальник успішно надіслано та збережено!`);
            
            // 4. Очищення форми після успішної відправки
            setFormData({
                sleepQuality: 5, sportLevel: 5, stressLevel: 5, officeExercises: 5,
                hasPain: 'Ні', painArea: [], painDescription: '',
            });

        } catch (error) {
            console.error("Помилка обробки опитувальника (Firebse/EmailJS):", error);
            alert("❌ Помилка: Звіт не надіслано або не збережено. Перевірте консоль.");
        }
    };
    
    // Компонент для слайдерів
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
                            <input type="radio" name="hasPain" value="Ні" checked={formData.hasPain === 'Ні'} onChange={handleChange} /> Ні
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

                <button type="submit" className="submit-button" disabled={loadingData}>
                    {loadingData ? 'Завантаження даних...' : 'Зберегти та надіслати опитувальник'}
                </button>
            </form>
        </div>
    );
};

export default WellnessControl;