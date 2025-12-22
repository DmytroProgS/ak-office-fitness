import React, { lazy, Suspense } from 'react'; 
import { HashRouter, Routes, Route } from 'react-router-dom'; 
import './styles/Global.css'; 

// 1. КОМПОНЕНТИ, ЯКІ ЗАВАНТАЖУЮТЬСЯ ОДРАЗУ
import MainLayout from './layouts/MainLayout/MainLayout';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; 
import HomeContent from './pages/HomeContent/HomeContent'; 
import TrainingLog from './pages/TrainingLog/TrainingLog';

// 2. КОМПОНЕНТИ, ЯКІ ЗАВАНТАЖУЮТЬСЯ ЛІНИВО
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const WellnessControl = lazy(() => import('./pages/WellnessControl/WellnessControl')); 
const InjuryStory = lazy(() => import('./pages/InjuryStory/InjuryStory')); 
const LoadSeason = lazy(() => import('./pages/LoadSeason/LoadSeason'));
const DailyIndividual = lazy(() => import('./pages/DailyIndividual/DailyIndividual'));
const WeeklyIndividual = lazy(() => import('./pages/WeeklyIndividual/WeeklyIndividual'));
const WeightControl = lazy(() => import('./pages/WeightControl/WeightControl'));
const VelocityControl = lazy(() => import('./pages/VelocityControl/VelocityControl'));
const Reports = lazy(() => import('./pages/Reports/Reports')); 
const Profile = lazy(() => import('./pages/Profile/Profile')); 

function App() {
    return (
        <HashRouter>
            <MainLayout>
                <Suspense fallback={<div className="loading-screen">Завантаження сторінки...</div>}>
                    <Routes>
                        <Route path="/" element={<HomeContent />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> 
                        <Route path="/wellness" element={<ProtectedRoute><WellnessControl /></ProtectedRoute>} />
                        <Route path="/injury" element={<ProtectedRoute><InjuryStory /></ProtectedRoute>} />
                        <Route path="/load" element={<ProtectedRoute><LoadSeason /></ProtectedRoute>} />
                        <Route path="/daily" element={<ProtectedRoute><DailyIndividual /></ProtectedRoute>} />
                        <Route path="/weekly" element={<ProtectedRoute><WeeklyIndividual /></ProtectedRoute>} />
                        <Route path="/weight" element={<ProtectedRoute><WeightControl /></ProtectedRoute>} />
                        <Route path="/velocity" element={<ProtectedRoute><VelocityControl /></ProtectedRoute>} />
                        <Route path="/training" element={<ProtectedRoute><TrainingLog /></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    </Routes>
                </Suspense>
            </MainLayout>
        </HashRouter>
    );
}

export default App;