import './Header.css';
import { useLocation } from 'react-router-dom';
// import { IconMoon, IconBell } from '../icons/Icons';
import { PAGE_TITLES } from '@constants/navigation';
import Icon from '@icon/Icon';

export default function Header() {
  const { pathname } = useLocation();
  const activePage = pathname;
  return (
    <header className="topbar">
      <h1 className="topbar__greeting">{PAGE_TITLES[activePage] ?? 'SUITD'}</h1>
      <div className="topbar__actions">
        <button className="icon-btn"><Icon name="Moon"/></button>
        <button className="icon-btn"><Icon name="Bell"/></button>
      </div>
    </header>
  );
}
