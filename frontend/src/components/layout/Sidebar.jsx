import './Sidebar.css';
import { IconHome, IconSchedule, IconServices, IconProfile, IconLogout } from '../icons/Icons';

export default function Sidebar() {
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
        <a href="#" className="sidebar__link sidebar__link--active">
          <IconHome /> главная
        </a>
        <a href="#" className="sidebar__link">
          <IconSchedule /> расписание
        </a>
        <a href="#" className="sidebar__link">
          <IconServices /> сервисы
        </a>
        <a href="#" className="sidebar__link">
          <IconProfile /> профиль
        </a>
      </nav>

      <a href="#" className="sidebar__logout">
        <IconLogout /> выход
      </a>
    </aside>
  );
}
