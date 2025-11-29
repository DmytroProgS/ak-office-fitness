import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Прогрів Firebase Auth
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
    const start = performance.now();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date(),
      });

      const end = performance.now();
      console.log(`⏱️ Реєстрація зайняла ${Math.round(end - start)} мс`);

      alert("Реєстрація успішна! Ви можете увійти.");
      navigate('/login');
    } catch (error) {
      console.error("Помилка реєстрації:", error.message);

      let errorMessage = "Невідома помилка реєстрації.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Ця електронна пошта вже використовується.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Пароль має бути не менше 6 символів.";
      } else {
        errorMessage = error.message;
      }

      alert(`Помилка реєстрації: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wellness-container">
      <h1>Реєстрація користувача</h1>
      <form onSubmit={register} className="wellness-form">
        <div className="contact-group">
          <div className="form-group half-width">
            <label htmlFor="firstName">Ім'я:</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="form-group half-width">
            <label htmlFor="lastName">Прізвище:</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Реєстрація..." : "Зареєструватися"}
        </button>

        <p style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>
          Вже маєте акаунт? <a href="/login" style={{ color: '#f7d540', textDecoration: 'none' }}>Увійти</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
