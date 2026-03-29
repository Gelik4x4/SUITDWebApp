import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import './AuthLayout.css';

const GROUPS = [
  '1-МД-1','1-МД-2','2-МД-1','2-МД-2','2-МД-3','2-МД-4','2-МД-5',
  '3-МД-1','3-МД-2','4-МД-1','4-МД-2',
  '1-ИТ-1','2-ИТ-1','2-ИТ-2','3-ИТ-1',
  '1-ДГ-1','2-ДГ-1','3-ДГ-1',
];

export default function RegisterScreen({ onRegister, onGoLogin }) {
  const [name,     setName]     = useState('');
  const [group,    setGroup]    = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [agreed,   setAgreed]   = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = () => {
    if (!name || !group || !email || !password) {
      setError('Заполните все поля'); return;
    }
    if (password.length < 8) {
      setError('Пароль слишком короткий'); return;
    }
    if (!agreed) {
      setError('Примите условия пользовательского соглашения'); return;
    }
    setError('');
    onRegister({ name, group, email, password });
  };

  return (
    <AuthLayout imageSrc="/src/components/img/auth/register.png">
      <h1 className="auth-title">Регистрация</h1>

      <div className="auth-field">
        <label className="auth-field__label">Имя</label>
        <input
          className="auth-input"
          placeholder="Иван"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label className="auth-field__label">Номер группы</label>
        <select
          className="auth-select"
          value={group}
          onChange={e => setGroup(e.target.value)}
        >
          <option value="">Номер группы</option>
          {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

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
        <label className="auth-field__label">Пароль</label>
        <input
          className="auth-input"
          type="password"
          placeholder="123abc..."
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <p className="auth-hint">комбинация минимум из 8 букв, цифр и символов</p>
      </div>

      <label className="auth-checkbox-row">
        <input
          type="checkbox"
          className="auth-checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
        />
        <span className="auth-checkbox-label">
          Согласен с условиями{' '}
          <a href="#" onClick={e => e.stopPropagation()}>пользовательского соглашения</a>
        </span>
      </label>

      {error && (
        <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
          {error}
        </p>
      )}

      <button className="auth-btn auth-btn--primary" onClick={handleSubmit}>
        Зарегистрироваться
      </button>

      <div className="auth-bottom">
        Уже есть аккаунт?<span onClick={onGoLogin}>Войти</span>
      </div>
    </AuthLayout>
  );
}
