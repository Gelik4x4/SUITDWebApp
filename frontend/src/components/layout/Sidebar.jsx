import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import './Sidebar.css';
import { IconHome, IconSchedule, IconServices, IconProfile, IconLogout } from '../icons/Icons';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activePage = '/' + pathname.split('/')[1];

  const pages = {
    '/home':     { label: 'главная',    Icon: IconHome },
    '/schedule': { label: 'расписание', Icon: IconSchedule },
    '/services': { label: 'сервисы',    Icon: IconServices },
    '/profile':  { label: 'профиль',    Icon: IconProfile },
  };

  const handleLogout = () => {
    /* Очищаем токен / флаг авторизации если есть */
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboarded');
    /* Переходим на страницу входа */
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <img src="/src/components/img/favicon.svg" alt="SUITD" />
        </div>
        <div>
          <div className="sidebar__logo-title">SUITD</div>
          <div className="sidebar__logo-sub">Students</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {Object.entries(pages).map(([page, { label, Icon }]) => (
          <NavLink
            key={page}
            className={`sidebar__link${page === activePage ? ' sidebar__link--active' : ''}`}
            to={page}
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout}>
        <IconLogout /> выход
      </button>
    </aside>
  );
}
