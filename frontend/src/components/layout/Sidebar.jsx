import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import './Sidebar.css';
import Icon from '@icon/Icon';

import { supabase } from '@supabaseClient';


export default function Sidebar() {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const activePage = '/' + pathname.split('/')[1];

  const pages = {
    '/home':     { label: 'главная',    name: 'Home' },
    '/schedule': { label: 'расписание', name: 'Schedule' },
    '/services': { label: 'сервисы',    name: 'Services' },
    '/profile':  { label: 'профиль',    name: 'Profile' },
  };

  const handleLogout = async () => {

    const { error } = await supabase.auth.signOut();
    queryClient.clear();
    
    if (error) {
      console.error('Ошибка при выходе:', error.message);
    } else {
      navigate('/');
      console.log('Вы вышли из системы, localStorage очищен');
    }
  };

  // const handleLogout = () => {
  //   /* Очищаем токен / флаг авторизации если есть */
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('onboarded');
  //   localStorage.removeItem('onboarding_done');
  //   /* Переходим на страницу входа */
  //   navigate('/login');
  // };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <img src="/src/assets/img/favicon.svg" alt="SUITD" />
        </div>
        <div>
          <div className="sidebar__logo-title">SUITD</div>
          <div className="sidebar__logo-sub">Students</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {Object.entries(pages).map(([page, { label, name }]) => (
          <NavLink
            key={page}
            className={`sidebar__link${page === activePage ? ' sidebar__link--active' : ''}`}
            to={page}
          >
            <Icon name={name} /> {label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout}>
        <Icon name="LogOut"/> выход
      </button>
    </aside>
  );
}
