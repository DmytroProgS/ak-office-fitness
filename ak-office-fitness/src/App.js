// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Імпорт компонентів сторінок
import MainLayout from './layouts/MainLayout/MainLayout';
import WellnessControl from './pages/WellnessControl/WellnessControl'; 
import InjuryStory from './pages/InjuryStory/InjuryStory'; 
import LoadSeason from './pages/LoadSeason/LoadSeason';
import DailyIndividual from './pages/DailyIndividual/DailyIndividual';
import WeeklyIndividual from './pages/WeeklyIndividual/WeeklyIndividual';
import WeightControl from './pages/WeightControl/WeightControl';
import VelocityControl from './pages/VelocityControl/VelocityControl';

// Компонент-заглушка для Головної сторінки
const HomeContent = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Ласкаво просимо до AK-Office-Fitness!</h2>
        <p>Оберіть розділ у бічному меню.</p>
        {/* Можна додати зображення сюди */}
    </div>
);


function App() {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomeContent />} />

                    {/* Маршрути тепер вказують на ваші нові компоненти */}
                    <Route path="/wellness" element={<WellnessControl />} />
                    <Route path="/injury" element={<InjuryStory />} />
                    <Route path="/load" element={<LoadSeason />} />
                    <Route path="/daily" element={<DailyIndividual />} />
                    <Route path="/weekly" element={<WeeklyIndividual />} />
                    <Route path="/weight" element={<WeightControl />} />
                    <Route path="/velocity" element={<VelocityControl />} />
                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
}

export default App;