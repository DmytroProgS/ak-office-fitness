// src/App.js

import React, { lazy, Suspense } from 'react'; // <<<< ДОДАЄМО lazy ТА Suspense
import { HashRouter, Routes, Route } from 'react-router-dom'; 

// 1. КОМПОНЕНТИ, ЯКІ ЗАВАНТАЖУЮТЬСЯ ОДРАЗУ (Login, Register, Головний Layout)
import MainLayout from './layouts/MainLayout/MainLayout';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; 
import HomeContent from './pages/HomeContent/HomeContent'; // Залишаємо його тут, якщо він маленький

// 2. КОМПОНЕНТИ, ЯКІ ЗАВАНТАЖУЮТЬСЯ ЛІНИВО (Сторінки кабінету)
// Вони будуть завантажуватися лише при переході на відповідний маршрут
const WellnessControl = lazy(() => import('./pages/WellnessControl/WellnessControl')); 
const InjuryStory = lazy(() => import('./pages/InjuryStory/InjuryStory')); 
const LoadSeason = lazy(() => import('./pages/LoadSeason/LoadSeason'));
const DailyIndividual = lazy(() => import('./pages/DailyIndividual/DailyIndividual'));
const WeeklyIndividual = lazy(() => import('./pages/WeeklyIndividual/WeeklyIndividual'));
const WeightControl = lazy(() => import('./pages/WeightControl/WeightControl'));
const VelocityControl = lazy(() => import('./pages/VelocityControl/VelocityControl'));


function App() {
    return (
        <HashRouter> 
            <MainLayout>
                
                {/* 3. ОБГОРТАЄМО УСІ ЛІНИВІ МАРШРУТИ У Suspense */}
                <Suspense 
                    // fallback - те, що відображається, поки код сторінки завантажується
                    fallback={<div style={{ color: 'white', padding: '50px', fontSize: '1.5em' }}>Завантаження кабінету...</div>}
                >
                    <Routes>
                        
                        {/* 1. НЕЗАХИЩЕНІ/НЕ-ЛІНИВІ МАРШРУТИ */}
                        <Route path="/" element={<HomeContent />} /> 
                        <Route path="/register" element={<Register />} /> 
                        <Route path="/login" element={<Login />} /> 
                        
                        {/* 2. ЗАХИЩЕНІ ЛІНИВІ МАРШРУТИ */}
                        {/* Тепер вони використовують ліниво завантажені компоненти */}
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
                        
                    </Routes>
                </Suspense> {/* <<<< Закінчення Suspense */}

            </MainLayout>
        </HashRouter>
    );
}

export default App;