import { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import './Sidebar.css';
import Icon from '@icon/Icon';
import { supabase } from '@supabaseClient';

import favicon from '@/assets/img/favicon.svg';

export function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="logout-overlay" onClick={onCancel}>
      <div className="logout-modal" onClick={e => e.stopPropagation()}>
        <p className="logout-modal__text">Вы действительно хотите выйти?</p>
        <div className="logout-modal__actions">
          <button className="logout-modal__btn logout-modal__btn--confirm" onClick={onConfirm}>
            Выйти
          </button>
          <button className="logout-modal__btn logout-modal__btn--cancel" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const queryClient  = useQueryClient();
  const navigate     = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const activePage = '/' + pathname.split('/')[1];

  const pages = {
    '/home':     { label: 'главная',    name: 'Home'     },
    '/schedule': { label: 'расписание', name: 'Schedule' },
    '/services': { label: 'сервисы',    name: 'Services' },
    '/chats':    { label: 'чаты',       name: 'Chat'     },
    '/profile':  { label: 'профиль',    name: 'Profile'  },
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    queryClient.clear();
    if (error) {
      console.error('Ошибка при выходе:', error.message);
    } else {
      navigate('/');
    }
    setShowLogout(false);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <img src={favicon} alt="SUITD" />
          </div>
          <div>
            <div className="sidebar__logo-title">ЦАТ</div>
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

        <button className="sidebar__logout" onClick={() => setShowLogout(true)}>
          <Icon name="LogOut" /> выход
        </button>
      </aside>

      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
}
