import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './LoadSeason.css';

const LoadSeason = () => {
    // Початкові дані (можна потім замінити на завантаження з Firebase)
    const [dailyLoadData, setDailyLoadData] = useState([
        { date: '2025-12-20', duration: 60, rpe: 7, distance: 8.5 },
        { date: '2025-12-21', duration: 90, rpe: 8, distance: 12.0 },
        { date: '2025-12-22', duration: 45, rpe: 5, distance: 5.2 },
        { date: '2025-12-23', duration: 70, rpe: 6, distance: 9.1 },
        { date: '2025-12-24', duration: 60, rpe: 7, distance: 8.0 },
    ]);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        duration: '',
        distance: '',
        rpe: 5
    });

    const [acwr, setAcwr] = useState(1.0);
    const loadChartRef = useRef(null);
    const distChartRef = useRef(null);
    const loadChartInstance = useRef(null);
    const distChartInstance = useRef(null);

    // Розрахунок ACWR
    useEffect(() => {
        calculateMetrics();
        updateCharts();
        // eslint-disable-next-line
    }, [dailyLoadData]);

    const calculateMetrics = () => {
        if (dailyLoadData.length === 0) return;

        const sortedData = [...dailyLoadData].sort((a, b) => new Date(b.date) - new Date(a.date));
        const today = new Date(sortedData[0].date);

        const getLoadForDays = (daysCount) => {
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - daysCount);
            
            return dailyLoadData
                .filter(item => {
                    const d = new Date(item.date);
                    return d <= today && d > startDate;
                })
                .reduce((sum, item) => sum + (item.duration * item.rpe), 0);
        };

        const acuteLoad = getLoadForDays(7);
        const chronicLoad28 = getLoadForDays(28) / 4;
        
        const ratio = chronicLoad28 > 0 ? (acuteLoad / chronicLoad28) : 1.0;
        setAcwr(ratio.toFixed(2));
    };

    const updateCharts = () => {
        const sorted = [...dailyLoadData].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sorted.map(d => d.date.split('-').slice(1).join('.'));
        const loadValues = sorted.map(d => d.duration * d.rpe);
        const distValues = sorted.map(d => d.distance);

        // Load Chart
        if (loadChartInstance.current) loadChartInstance.current.destroy();
        loadChartInstance.current = new Chart(loadChartRef.current, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Session Load',
                    data: loadValues,
                    borderColor: '#5d50c6',
                    backgroundColor: 'rgba(93, 80, 198, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });

        // Distance Chart
        if (distChartInstance.current) distChartInstance.current.destroy();
        distChartInstance.current = new Chart(distChartRef.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Кілометри',
                    data: distValues,
                    backgroundColor: '#50c65d'
                }]
            },
            options: { responsive: true }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEntry = {
            date: formData.date,
            duration: parseInt(formData.duration),
            distance: parseFloat(formData.distance),
            rpe: parseInt(formData.rpe)
        };

        setDailyLoadData(prev => {
            const filtered = prev.filter(item => item.date !== newEntry.date);
            return [...filtered, newEntry];
        });

        setFormData({ ...formData, duration: '', distance: '' });
        alert('Дані збережено!');
    };

    // Визначаємо кут стрілки (від -90 до 90 градусів)
    const getNeedleRotation = () => {
        let val = parseFloat(acwr);
        if (val > 2.0) val = 2.0;
        return (val * 90) - 90; 
    };

    const getStatusClass = () => {
        if (acwr >= 0.8 && acwr <= 1.3) return 'status-safe';
        if (acwr > 1.5 || acwr < 0.5) return 'status-danger';
        return 'status-warning';
    };

    return (
        <div className="load-season-container">
            <h1 className="page-title">Load Season: Контроль навантаження</h1>
            
            <div className="dashboard-container">
                <div className="left-column">
                    <div className="form-card">
                        <h3>Додати тренування</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Дата:</label>
                                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Тривалість (хв):</label>
                                <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="напр. 60" required />
                            </div>
                            <div className="form-group">
                                <label>Дистанція (км):</label>
                                <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleInputChange} placeholder="напр. 5.5" required />
                            </div>
                            <div className="form-group">
                                <label>RPE (Інтенсивність 1-10):</label>
                                <div className="rpe-scale">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <div key={num} className="rpe-item">
                                            <input type="radio" id={`rpe-${num}`} name="rpe" value={num} checked={Number(formData.rpe) === num} onChange={handleInputChange} />
                                            <label htmlFor={`rpe-${num}`} className="rpe-label">{num}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="submit-btn">Зберегти тренування</button>
                        </form>
                    </div>
                </div>

                <div className="right-column">
                    <div className="stats-card">
                        <h3>Ваш показник ACWR</h3>
                        <div className="gauge-wrapper">
                            <div className="gauge-body"></div>
                            <div className="gauge-needle-pivot"></div>
                            <div className="gauge-needle" style={{ transform: `translateX(-50%) rotate(${getNeedleRotation()}deg)` }}></div>
                            <div className="gauge-value-text">
                                <span id="acwr-value">{acwr}</span>
                                <p className={getStatusClass()}>
                                    {acwr >= 0.8 && acwr <= 1.3 ? 'Безпечна зона' : 'Увага / Ризик'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h4>Графік навантаження</h4>
                        <canvas ref={loadChartRef}></canvas>
                    </div>

                    <div className="chart-card">
                        <h4>Дистанція по днях</h4>
                        <canvas ref={distChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadSeason;