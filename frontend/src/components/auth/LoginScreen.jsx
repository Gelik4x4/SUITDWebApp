import { useState } from 'react';
import AuthLayout from './AuthLayout';
import './AuthLayout.css';
import Icon from '@icon/Icon';

import authImage from '@/assets/img/auth/login.png';

import { supabase } from '@supabaseClient'


async function handleRegister(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      // Дополнительные данные (имя, ID группы), которые попадут в профиль
      data: {
        first_name: "Артем",
        middle_name: "Владиславович",
        last_name: "Кузнецов",
        group_name: "3-МД-4",
        // is_temp_password: 
      },
    },
  });

  if (error) {
    console.error("Ошибка регистрации:", error.message);
    return { success: false, error: error.message };
  }

  console.log("Пользователь создан:", data.user);
  return { success: true, user: data.user };
}


export default function LoginScreen({ onLogin, onGoRegister }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    setError('');
    
    try {
      // handleRegister(email, password); // Регистрация пользователей
      // 1. Пытаемся войти через Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        // Если пароль неверный или юзера нет, Supabase вернет ошибку
        setError('Неверный email или пароль');
        return;
      }

      // 2. Если вход успешен, получаем дополнительные данные из таблицы users
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        console.log("Пользователь найден и профиль загружен:", profile);
        
        // 3. Передаем объединенный объект в функцию входа вашего приложения
        onLogin({ 
          ...data.user,    // системные данные (email, id)
          ...profile,      // ваши данные (имя, аватар и т.д.)
          remember 
        }); 
      }
      
    } catch (err) {
      setError('Ошибка при подключении к базе данных');
      console.error(err);
    }
  };

  return (
    <AuthLayout imageSrc={authImage}>
      <h1 className="auth-title">Вход</h1>

      <div className="auth-field">
        <label className="auth-field__label">Почта</label>
        <input
          className="auth-input"
          type="email"
          autoComplete="username"
          placeholder="petrov@yandex.ru"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <div className="auth-field__label-row">
          <label className="auth-field__label">Пароль</label>
          <a className="auth-field__link" href="#">Забыли пароль?</a>
        </div>
        <div className="auth-password">
          <input
            className="auth-input auth-input--password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button
            type="button"
            className="auth-password__toggle"
            onClick={() => setShowPassword(value => !value)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <Icon name="Eye" /> : <Icon name="EyeСlosed" />}
          </button>
        </div>
      </div>

      <label className="auth-checkbox-row" style={{ marginBottom: '24px' }}>
        <span className={`auth-checkbox-box ${remember ? 'auth-checkbox-box--checked' : ''}`}>
          <input
            type="checkbox"
            className="auth-checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          {remember && <Icon name="Tick" />}
        </span>
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

      {/* <div className="auth-bottom">
        Нет аккаунта?<span onClick={onGoRegister}>Зарегистрироваться</span>
      </div> */}
    </AuthLayout>
  );
}
