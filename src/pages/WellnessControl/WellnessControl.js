import React, { useState } from 'react';
import emailjs from '@emailjs/browser'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import useUserData from '../../hooks/useUserData'; 
import { db, auth } from '../../firebase'; 

import './WellnessControl.css'; 

// Ваші діючі ключі
const EMAILJS_SERVICE_ID = 'service_m3w0lih';   
const EMAILJS_TEMPLATE_ID = 'template_6cig964'; 
const EMAILJS_PUBLIC_KEY = 'h4ZitYEvI_2ynZzgm'; 
const RECIPIENT_EMAIL = 'akkfitness13@gmail.com'; 

emailjs.init(EMAILJS_PUBLIC_KEY);

const WellnessControl = () => {
    const { userData, loading: loadingData } = useUserData();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        sleepQuality: 5,         
        sportLevel: 5,           
        stressLevel: 5,          
        officeExercises: 5,      
        hasPain: 'Ні',           
        painArea: [],            
        painDescription: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const updatedPainArea = checked
                ? [...formData.painArea, value]
                : formData.painArea.filter((area) => area !== value);
            setFormData({ ...formData, painArea: updatedPainArea });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData) {
            alert("Помилка: Дані користувача не завантажені.");
            return;
        }

        setIsSubmitting(true);

        const templateParams = {
            user_name: `${userData.firstName || ''} ${userData.lastName || ''}`,
            user_email: userData.email,
            to_email: RECIPIENT_EMAIL,
            sleep_quality: formData.sleepQuality,
            sport_level: formData.sportLevel,
            stress_level: formData.stressLevel,
            office_exercises: formData.officeExercises,
            has_pain: formData.hasPain,
            pain_area: formData.painArea.join(', ') || 'Не вказано',
            pain_description: formData.painDescription || 'Немає опису',
        };

        try {
            // 1. Збереження в Firestore
            await addDoc(collection(db, 'wellness'), {
                ...formData,
                userId: auth.currentUser.uid,
                userName: templateParams.user_name,
                userEmail: userData.email,
                createdAt: serverTimestamp(),
            });

            // 2. Відправка EmailJS
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

            alert('Опитувальник успішно надіслано!');
        } catch (error) {
            console.error('Помилка при відправці:', error);
            alert('Сталася помилка. Спробуйте ще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Функція для розрахунку статусу (динаміка для правої панелі)
    const getStatus = (val) => {
        const value = parseInt(val);
        if (value <= 3) return { text: "Погано", color: "#ff4d4d" };
        if (value <= 7) return { text: "Нормально", color: "#f7d540" };
        return { text: "Відмінно", color: "#4caf50" };
    };

    // Середній бал для головного індикатора
    const averageScore = ((parseInt(formData.sleepQuality) + parseInt(formData.sportLevel) + 
                          (11 - parseInt(formData.stressLevel)) + parseInt(formData.officeExercises)) / 4).toFixed(1);

    if (loadingData) return <div className="loading">Завантаження профілю...</div>;

    return (
        <div className="wellness-page">
            <h1 className="page-title">Велнес-контроль</h1>
            
            <div className="wellness-grid">
                {/* ЛІВА ЧАСТИНА: ФОРМА */}
                <form className="wellness-form-card" onSubmit={handleSubmit}>
                    
                    <div className="input-group-wellness">
                        <label><i className="fas fa-bed"></i> Якість сну ({formData.sleepQuality}/10)</label>
                        <input type="range" name="sleepQuality" min="1" max="10" value={formData.sleepQuality} onChange={handleChange} />
                    </div>

                    <div className="input-group-wellness">
                        <label><i className="fas fa-running"></i> Спортивна активність ({formData.sportLevel}/10)</label>
                        <input type="range" name="sportLevel" min="1" max="10" value={formData.sportLevel} onChange={handleChange} />
                    </div>

                    <div className="input-group-wellness">
                        <label><i className="fas fa-brain"></i> Рівень стресу ({formData.stressLevel}/10)</label>
                        <input type="range" name="stressLevel" min="1" max="10" value={formData.stressLevel} onChange={handleChange} />
                    </div>

                    <div className="input-group-wellness">
                        <label><i className="fas fa-dumbbell"></i> Офісні вправи ({formData.officeExercises}/10)</label>
                        <input type="range" name="officeExercises" min="1" max="10" value={formData.officeExercises} onChange={handleChange} />
                    </div>

                    <div className="pain-section">
                        <h3><i className="fas fa-exclamation-triangle"></i> Чи є дискомфорт/біль?</h3>
                        <div className="radio-group">
                            <label><input type="radio" name="hasPain" value="Так" checked={formData.hasPain === 'Так'} onChange={handleChange} /> Так</label>
                            <label><input type="radio" name="hasPain" value="Ні" checked={formData.hasPain === 'Ні'} onChange={handleChange} /> Ні</label>
                        </div>

                        {formData.hasPain === 'Так' && (
                            <div className="pain-details animate-fade">
                                <p>Оберіть зону:</p>
                                <div className="checkbox-grid">
                                    {['Шия', 'Спина', 'Поперек', 'Плечі', 'Коліна', 'Кисті'].map(area => (
                                        <label key={area} className="check-item">
                                            <input type="checkbox" value={area} checked={formData.painArea.includes(area)} onChange={handleChange} /> {area}
                                        </label>
                                    ))}
                                </div>
                                <textarea 
                                    name="painDescription" 
                                    placeholder="Опишіть детальніше..." 
                                    value={formData.painDescription} 
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-save-wellness" disabled={isSubmitting}>
                        {isSubmitting ? "Надсилаємо..." : "Зберегти та надіслати"}
                    </button>
                </form>

                {/* ПРАВА ЧАСТИНА: ДИНАМІЧНІ ПОКАЗНИКИ */}
                <div className="wellness-indicators">
                    <div className="indicator-card">
                        <span className="indicator-label">Загальний індекс</span>
                        <div className="indicator-value" style={{color: getStatus(averageScore * 1).color}}>
                            {averageScore}
                        </div>
                        <p className="indicator-desc">Ваш стан на основі опитування</p>
                    </div>

                    <div className="mini-stats">
                        <div className="stat-box">
                            <span className="stat-title">Сон</span>
                            <span className="stat-val" style={{color: getStatus(formData.sleepQuality).color}}>{getStatus(formData.sleepQuality).text}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-title">Стрес</span>
                            <span className="stat-val" style={{color: getStatus(11 - formData.stressLevel).color}}>{getStatus(11 - formData.stressLevel).text}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-title">Біль</span>
                            <span className="stat-val">{formData.hasPain === 'Так' ? 'Присутній' : 'Відсутній'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessControl;