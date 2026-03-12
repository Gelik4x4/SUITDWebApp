import './Header.css';
import { IconMoon, IconBell } from '../icons/Icons';

export default function Header() {
  return (
    <header className="topbar">
      <h1 className="topbar__greeting">Доброе утро!</h1>
      <div className="topbar__actions">
        <button className="icon-btn"><IconMoon /></button>
        <button className="icon-btn"><IconBell /></button>
      </div>
    </header>
  );
}
