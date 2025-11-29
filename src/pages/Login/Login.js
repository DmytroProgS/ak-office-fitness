import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false); // індикатор входу
  const navigate = useNavigate();

  // Прогрів Firebase Auth (щоб зменшити затримку при першому вході)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {});
    return () => unsubscribe();
  }, []);

  // Якщо користувач уже увійшов
  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const start = performance.now();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const end = performance.now();
      console.log(`⏱️ Вхід зайняв ${Math.round(end - start)} мс`);
      // Успішний вхід обробляється useEffect
    } catch (error) {
      console.error("Помилка входу:", error.message);

      let errorMessage = "Невідома помилка входу.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Користувача з такою поштою не існує.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Невірний пароль.";
      } else {
        errorMessage = error.message;
      }

      alert(`Помилка входу: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wellness-container">
      <h1>Вхід в Особистий Кабінет</h1>
      <form onSubmit={login} className="wellness-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Вхід..." : "Увійти"}
        </button>

        <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
          Не маєте акаунту? <a href="/register" style={{ color: '#f7d540', textDecoration: 'none' }}>Зареєструватися</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
