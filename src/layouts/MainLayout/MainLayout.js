import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './MainLayout.css';
import logo from '../../assets/images/AK_logo.png'; // Імпорт лого

const MainLayout = ({ children }) => {
    const [user, loadingAuth] = useAuthState(auth);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (loadingAuth) return <div className="loading">Завантаження...</div>;

    const isUserLoggedIn = !!user;
    const isCabinet = isUserLoggedIn && !['/', '/login', '/register', '/about'].includes(location.pathname);

    return (
        <div className="app-container">
            <header className="top-header">
                <div className="header-left">
                    <Link to="/" className="header-logo-link">
                        <img src={logo} alt="AK Logo" className="header-logo-img" />
                        <span className="brand-name">Pro<span className="gold-text">Athlete</span>Care</span>
                    </Link>
                </div>

                <nav className="header-nav">
                    <Link to="/" className="nav-item-link">Головна</Link>
                    <Link to="/about" className="nav-item-link">Про нас</Link>
                    
                    {isUserLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="nav-item-link">Кабінет</Link>
                            <div className="user-controls">
                                <span className="user-email">{user.email.split('@')[0]}</span>
                                <button className="logout-header-btn" onClick={handleLogout}>Вийти</button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-nav-buttons">
                            <Link to="/login" className="nav-item-link">Увійти</Link>
                            <Link to="/register" className="btn-signup-nav">Реєстрація</Link>
                        </div>
                    )}
                </nav>
            </header>
            
            <div className="layout-body">
                {isCabinet && <Sidebar />}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;