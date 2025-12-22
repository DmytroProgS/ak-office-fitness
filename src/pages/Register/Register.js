import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../firebase';
import './Register.css'; // Обов'язково додайте цей імпорт

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {});
    return () => unsubscribe();
  }, []);

  const register = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      alert("Будь ласка, введіть Ім'я та Прізвище");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        uid: user.uid,
        createdAt: new Date(),
      });

      alert("Реєстрація успішна!");
      navigate('/login');
    } catch (error) {
      console.error("Помилка реєстрації:", error.message);
      alert(`Помилка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Реєстрація</h1>
        <form onSubmit={register} className="auth-form">
          <div className="input-row">
            <div className="form-group">
              <label>Ім'я</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ім'я" required />
            </div>
            <div className="form-group">
              <label>Прізвище</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Прізвище" required />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" required />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Мінімум 6 символів" required />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Завантаження..." : "Зареєструватися"}
          </button>

          <p className="auth-footer">
            Вже маєте акаунт? <Link to="/login">Увійти</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;