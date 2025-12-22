// src/components/WellnessChart/WellnessChart.js

import React from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import './WellnessChart.css'; // Локальні стилі

// Компонент графіка Recharts
const WellnessChart = ({ data, dataKey, title, lineColor = 'var(--primary-color)' }) => {
    
    // Форматуємо дані: Recharts вимагає масив об'єктів
    const formattedData = data.map(record => ({
        // Форматуємо дату для осі X (наприклад, "12/03")
        date: record.timestamp ? new Date(record.timestamp).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }) : 'Н/Д',
        // Зберігаємо фактичне значення
        value: record[dataKey],
    })).filter(item => item.value !== undefined); // Видаляємо записи без значення

    if (formattedData.length === 0) {
        return <div className="no-chart-data">Недостатньо даних для відображення графіка {title}.</div>;
    }

    // 

    return (
        <div className="chart-container-wrapper">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart
                    data={formattedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-color)" />
                    
                    {/* Вісь X: Дати */}
                    <XAxis dataKey="date" stroke="var(--text-muted)" />
                    
                    {/* Вісь Y: Показники 1-10 */}
                    <YAxis 
                        domain={[1, 10]} 
                        stroke="var(--text-muted)" 
                        allowDecimals={false}
                        tickCount={10} 
                    />
                    
                    {/* Підказки при наведенні */}
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card-bg)', border: 'none' }}
                        itemStyle={{ color: lineColor }}
                    />
                    
                    {/* Легенда (назва лінії) */}
                    <Legend />
                    
                    {/* Сама лінія графіка */}
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        name={title}
                        stroke={lineColor}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WellnessChart;