import React from 'react';
import useUserData from '../../hooks/useUserData'; 
import useLastWellnessRecord from '../../hooks/useLastWellnessRecord'; // ⭐ Потрібен один раз
import useWellnessRecordsHistory from '../../hooks/useWellnessRecordsHistory'; 
import WellnessChart from '../../components/WellnessChart/WellnessChart'; 
import DashboardCard from '../../components/DashboardCard/DashboardCard';

import './Dashboard.css'; // Переконайтеся, що цей файл існує

const Dashboard = () => {
    // 1. Отримуємо дані користувача (для привітання)
    const { userData } = useUserData();
    
    // 2. Отримуємо останній запис Wellness (для карток)
    const { lastRecord, loading: loadingLast } = useLastWellnessRecord();
    
    // 3. Отримуємо історію записів за останні 30 днів (для графіків)
    const { history, loading: loadingHistory, error: historyError } = useWellnessRecordsHistory(30); 

    // Об'єднуємо стан завантаження
    if (loadingLast || loadingHistory) {
        return (
            <div className="dashboard-container">
                <h1 className="page-title">Завантаження показників...</h1>
                <p>Дані завантажуються. Зачекайте, будь ласка.</p>
            </div>
        );
    }

    if (historyError) {
        return (
            <div className="dashboard-container">
                <h1 className="page-title">Помилка завантаження</h1>
                <p className="status-error">Не вдалося завантажити дані. Спробуйте оновити сторінку.</p>
            </div>
        );
    }
    
    // Відображаємо інформацію, навіть якщо немає останнього запису, 
    // але не можемо відобразити картки
    if (!lastRecord) {
        return (
             <div className="dashboard-container">
                <h1 className="page-title">Привіт, {userData?.firstName || 'Користувач'}!</h1>
                <p>
                    Ласкаво просимо до вашої Панелі управління. Будь ласка, заповніть
                    <a href="/#/wellness"> Велнес-контроль</a>, щоб почати бачити свої показники.
                </p>
                {/* Все ще відображаємо графіки, якщо історія не порожня */}
                {history.length > 0 && (
                    <div className="dashboard-content">
                         <div className="chart-grid">
                            <div className="dashboard-card chart-section">
                                <WellnessChart 
                                    data={history} 
                                    dataKey="sleepQuality" 
                                    title="Якість сну (1-10)" 
                                    lineColor="var(--success-color)"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ⭐ ОСНОВНИЙ РЕНДЕР
    return (
        <div className="dashboard-container">
            <h1 className="page-title">Панель управління</h1>

            <div className="dashboard-content">
                {/* -------------------- КАРТКИ ПОКАЗНИКІВ -------------------- */}
                <div className="card-grid">
                    <DashboardCard 
                        title="Якість сну" 
                        value={lastRecord.sleepQuality} 
                        unit="/ 10" 
                        description="Оцінка останнього сну" 
                        icon="😴"
                    />
                    <DashboardCard 
                        title="Рівень стресу" 
                        value={lastRecord.stressLevel} 
                        unit="/ 10" 
                        description="Оцінка останнього стресу" 
                        icon="🤯"
                        color="var(--danger-color)"
                    />
                    <DashboardCard 
                        title="Спорт" 
                        value={lastRecord.sportLevel} 
                        unit="/ 10" 
                        description="Оцінка останньої активності" 
                        icon="🏃"
                        color="var(--primary-color)"
                    />
                    <DashboardCard 
                        title="Біль/Дискомфорт" 
                        value={lastRecord.hasPain === 'Так' ? lastRecord.painArea.join(', ') : 'Ні'} 
                        unit="" 
                        description="Останній звіт" 
                        icon="🤕"
                        color={lastRecord.hasPain === 'Так' ? 'var(--danger-color)' : 'var(--success-color)'}
                    />
                </div>
                
                {/* -------------------- СЕКЦІЯ ГРАФІКІВ -------------------- */}
                {history.length > 0 && (
                    <div className="chart-grid">
                        <div className="dashboard-card chart-section">
                            <WellnessChart 
                                data={history} 
                                dataKey="sleepQuality" 
                                title="Якість сну (1-10)" 
                                lineColor="var(--success-color)"
                            />
                        </div>
                        
                        <div className="dashboard-card chart-section">
                            <WellnessChart 
                                data={history} 
                                dataKey="stressLevel" 
                                title="Рівень стресу (1-10)" 
                                lineColor="var(--danger-color)"
                            />
                        </div>

                        <div className="dashboard-card chart-section">
                            <WellnessChart 
                                data={history} 
                                dataKey="sportLevel" 
                                title="Рівень спорту (1-10)" 
                                lineColor="var(--primary-color)"
                            />
                        </div>
                    </div>
                )}
                
                {history.length === 0 && (
                    <p style={{ marginTop: '20px' }}>
                        Недостатньо даних для відображення графіків. Заповніть Велнес-контроль.
                    </p>
                )}

            </div>
        </div>
    );
};

export default Dashboard;