// src/components/PasswordProtect.js
import React, { useState } from 'react';

const PasswordProtect = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(
    localStorage.getItem('site_auth') === 'true'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_SITE_PASSWORD) {
      localStorage.setItem('site_auth', 'true');
      setIsAuthorized(true);
    } else {
      alert('Невірний пароль!');
    }
  };

  if (isAuthorized) {
    return children;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleSubmit}>
        <h3>Сайт у розробці. Введіть пароль:</h3>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Пароль"
        />
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default PasswordProtect;