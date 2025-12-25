import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
// Додаємо Link сюди:
import { useNavigate, Link } from 'react-router-dom'; 
import Sidebar from '../../components/Sidebar/Sidebar';
import './MainLayout.css';
import logo from '../../assets/images/AK_logo.png';


const MainLayout = ({ children }) => {
    const [user, loadingAuth] = useAuthState(auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (loadingAuth) return <div className="loading">Завантаження...</div>;

    const isUserLoggedIn = !!user;

    return (
        <div className="app-container">
            {isUserLoggedIn && (
                <header className="top-header">
                    <div className="header-left">
    <Link to="/" className="header-logo-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="AK" className="header-logo" />
        <span className="brand-name">ProAthleteCare</span>
    </Link>
</div>
                    <div className="header-right">
                        <span className="user-greeting">
                            Привіт, <strong>{user.email.split('@')[0]}</strong>
                        </span>
                        <button className="logout-header-btn" onClick={handleLogout}>Вийти</button>
                    </div>
                </header>
            )}
            
            <div className={isUserLoggedIn ? "dashboard-wrapper" : "auth-wrapper"}>
                {isUserLoggedIn && <Sidebar />}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;