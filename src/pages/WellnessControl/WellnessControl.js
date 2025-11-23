import React from 'react';

const WellnessControl = () => {
    // Назва розділу, яку ми будемо відображати
    const title = "WELLNESS CONTROL"; 
    
    return (
        <div className="page-content">
            {/* Заголовок розділу */}
            <h1>{title}</h1>
            
            {/* Основний текст */}
            <p>Тут буде інформація про {title}.</p>
        </div>
    );
};

export default WellnessControl;