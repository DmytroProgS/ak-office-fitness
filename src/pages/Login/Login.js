import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError("Невірний email або пароль");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Вхід у <span className="gold-text">PAC</span></h1>
                <p className="auth-subtitle">Ваш професійний кабінет атлета</p>
                
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Електронна пошта" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Пароль" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-auth-submit">Увійти</button>
                </form>
                
                <p className="auth-footer">
                    Немає акаунту? <Link to="/register">Зареєструватися</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;