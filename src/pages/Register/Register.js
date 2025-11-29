// src/pages/Register/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // <--- ДОДАНО: Функції Firestore
import { auth, db } from '../../firebase'; // <--- ДОДАНО: Екземпляр db (Firestore)

// Припускаємо, що стилі Register.css використовують ті ж класи, що й Wellness
// import './Register.css'; 

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName) {
            alert("Будь ласка, введіть Ім'я та Прізвище");
            return;
        }

        try {
            // 1. Створення користувача в Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // 2. ЗБЕРЕЖЕННЯ ДАНИХ У FIRESTORE
            // Використовуємо UID користувача як унікальний ID документа в колекції 'users'
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                createdAt: new Date(), // Додаткова інформація
            });

            alert("Реєстрація успішна! Ви можете увійти.");
            navigate('/login'); // Перенаправлення на сторінку входу
        } catch (error) {
            console.error("Помилка реєстрації:", error.message);
            
            // Краще обробляти специфічні помилки Firebase
            let errorMessage = "Невідома помилка реєстрації.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Ця електронна пошта вже використовується.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Пароль має бути не менше 6 символів.";
            } else {
                errorMessage = error.message;
            }
            
            alert(`Помилка реєстрації: ${errorMessage}`);
        }
    };

    return (
        <div className="wellness-container">
            <h1>Реєстрація користувача</h1>
            <form onSubmit={register} className="wellness-form">
                
                <div className="contact-group">
                    <div className="form-group half-width">
                        <label htmlFor="firstName">Ім'я:</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="form-group half-width">
                        <label htmlFor="lastName">Прізвище:</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                <button type="submit" className="submit-button">Зареєструватися</button>
                <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
                    Вже маєте акаунт? <a href="/login" style={{ color: '#f7d540', textDecoration: 'none' }}>Увійти</a>
                </p>
            </form>
        </div>
    );
};

export default Register;