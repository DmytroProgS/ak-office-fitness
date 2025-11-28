// src/App.js

import React from 'react';
// 1. ВИКОРИСТОВУЄМО HASHROUTER для GitHub Pages
import { HashRouter, Routes, Route } from 'react-router-dom'; 

// Імпорт компонентів сторінок
import HomeContent from './pages/HomeContent/HomeContent';
import MainLayout from './layouts/MainLayout/MainLayout';
import WellnessControl from './pages/WellnessControl/WellnessControl'; 
import InjuryStory from './pages/InjuryStory/InjuryStory'; 
import LoadSeason from './pages/LoadSeason/LoadSeason';
import DailyIndividual from './pages/DailyIndividual/DailyIndividual';
import WeeklyIndividual from './pages/WeeklyIndividual/WeeklyIndividual';
import WeightControl from './pages/WeightControl/WeightControl';
import VelocityControl from './pages/VelocityControl/VelocityControl';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // <-- ІМПОРТ ЗАХИСТУ


function App() {
    return (
        // 2. ЗАМІНА BrowserRouter на HashRouter
        <HashRouter> 
            <MainLayout>
                <Routes>
                    
                    {/* 1. Головна сторінка: / та /# */}
                    <Route path="/" element={<HomeContent />} /> 

                    {/* 2. Маршрути АУТЕНТИФІКАЦІЇ (доступні завжди) */}
                    <Route path="/register" element={<Register />} /> 
                    <Route path="/login" element={<Login />} /> 
                    
                    {/* 3. ЗАХИЩЕНІ МАРШРУТИ (потрібен вхід) */}
                    <Route path="/wellness" element={
                        <ProtectedRoute><WellnessControl /></ProtectedRoute>
                    } />
                    <Route path="/injury" element={
                        <ProtectedRoute><InjuryStory /></ProtectedRoute>
                    } />
                    <Route path="/load" element={
                        <ProtectedRoute><LoadSeason /></ProtectedRoute>
                    } />
                    <Route path="/daily" element={
                        <ProtectedRoute><DailyIndividual /></ProtectedRoute>
                    } />
                    <Route path="/weekly" element={
                        <ProtectedRoute><WeeklyIndividual /></ProtectedRoute>
                    } />
                    <Route path="/weight" element={
                        <ProtectedRoute><WeightControl /></ProtectedRoute>
                    } />
                    <Route path="/velocity" element={
                        <ProtectedRoute><VelocityControl /></ProtectedRoute>
                    } />

                    {/* Додатково: Маршрут для 404 або перенаправлення (за бажанням) */}
                    {/* <Route path="*" element={<HomeContent />} /> */}
                    
                </Routes>
            </MainLayout>
        </HashRouter>
    );
}

export default App;