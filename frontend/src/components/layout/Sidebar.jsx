import './Sidebar.css';
import { IconHome, IconSchedule, IconServices, IconProfile, IconLogout } from '../icons/Icons';


export default function Sidebar({ activePage, onNavigate }) {
  const links = [
    { id: 'home',     label: 'главная',    Icon: IconHome },
    { id: 'schedule', label: 'расписание', Icon: IconSchedule },
    { id: 'services', label: 'сервисы',    Icon: IconServices },
    { id: 'profile',  label: 'профиль',    Icon: IconProfile },
  ];

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
        {links.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`sidebar__link${activePage === id ? ' sidebar__link--active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon /> {label}
          </button>
        ))}
      </nav>

      <button className="sidebar__logout">
        <IconLogout /> выход
      </button>
    </aside>
  );
}
