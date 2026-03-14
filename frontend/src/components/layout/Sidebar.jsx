import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { IconHome, IconSchedule, IconServices, IconProfile, IconLogout } from '../icons/Icons';


export default function Sidebar() {
  const location = useLocation();
  const activePage = location.pathname
  const pages = {
    '/home':     { label: 'главная',    Icon: IconHome },
    '/schedule': { label: 'расписание', Icon: IconSchedule },
    '/services': { label: 'сервисы',    Icon: IconServices },
    '/profile':  { label: 'профиль',    Icon: IconProfile },
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <rect x="3"  y="3"  width="8" height="8" rx="1" />
            <rect x="13" y="3"  width="8" height="8" rx="1" />
            <rect x="3"  y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </div>
        <div>
          <div className="sidebar__logo-title">SUITD.</div>
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

      <button className="sidebar__logout">
        <IconLogout /> выход
      </button>
    </aside>
  );
}
