// src/components/ProtectedRoute/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

// Увага! Шлях імпорту до firebase повинен бути коректним
// Оскільки цей файл знаходиться в src/components/ProtectedRoute,
// для переходу до src/firebase.js потрібно два кроки вгору: ../../
import { auth } from '../../firebase'; 

const ProtectedRoute = ({ children }) => {
    
    // 1. Отримуємо стан користувача від Firebase
    const [user, loading] = useAuthState(auth); 

    // 2. Якщо дані Firebase ще завантажуються
    if (loading) {
        // Відображаємо екран завантаження, поки Firebase перевіряє токен
        return <div style={{ color: 'white', padding: '50px', fontSize: '1.5em' }}>
                   Завантаження аутентифікації...
               </div>;
    }

    // 3. Якщо користувач НЕ увійшов (user === null)
    if (!user) {
        // Перенаправляємо його на сторінку входу/реєстрації
        // 'replace' гарантує, що сторінка, на яку він намагався зайти, не залишиться в історії браузера.
        return <Navigate to="/login" replace />;
    }

    // 4. Якщо користувач увійшов (user не null)
    // Дозволяємо відображення дочірніх компонентів (тобто самої сторінки)
    return children;
};

export default ProtectedRoute;