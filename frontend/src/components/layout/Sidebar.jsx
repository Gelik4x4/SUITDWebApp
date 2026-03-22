import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { IconHome, IconSchedule, IconServices, IconProfile, IconLogout } from '../icons/Icons';


export default function Sidebar() {
  const { pathname } = useLocation();
  const activePage = '/' + pathname.split('/')[1];
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
          <img src="/src/components/img/favicon.svg"/>
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

      <button className="sidebar__logout">
        <IconLogout /> выход
      </button>
    </aside>
  );
}
