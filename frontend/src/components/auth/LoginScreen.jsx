import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import './AuthLayout.css';

export default function LoginScreen({ onLogin, onGoRegister }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    setError('');
    onLogin({ email, password, remember });
  };

  return (
    <AuthLayout imageSrc="/src/components/img/auth/login.png">
      <h1 className="auth-title">Вход</h1>

      <div className="auth-field">
        <label className="auth-field__label">Почта</label>
        <input
          className="auth-input"
          type="email"
          placeholder="petrovich@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <div className="auth-field__label-row">
          <label className="auth-field__label">Пароль</label>
          <a className="auth-field__link" href="#">Забыли пароль?</a>
        </div>
        <input
          className="auth-input"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      <label className="auth-checkbox-row" style={{ marginBottom: '24px' }}>
        <input
          type="checkbox"
          className="auth-checkbox"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
        />
        <span className="auth-checkbox-label">Запомнить меня</span>
      </label>

      {error && (
        <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
          {error}
        </p>
      )}

      <button className="auth-btn auth-btn--primary" onClick={handleSubmit}>
        Войти
      </button>

      <div className="auth-bottom">
        Нет аккаунта?<span onClick={onGoRegister}>Зарегистрироваться</span>
      </div>
    </AuthLayout>
  );
}
