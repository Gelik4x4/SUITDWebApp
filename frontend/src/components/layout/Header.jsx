import { useState, useEffect } from 'react';
import './Header.css';
import { useLocation } from 'react-router-dom';
import { PAGE_TITLES } from '@constants/navigation';
import Icon from '@icon/Icon';
import NotificationsModal from '../notifications/NotificationsModal';

/* Страницы где на мобиле свой хедер — глобальный скрываем */
const MOBILE_HEADER_HIDDEN = ['/profile', '/chats'];

export default function Header() {
  const { pathname } = useLocation();
  const activePage = pathname;
  const [showNotif, setShowNotif] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  /* Применяем/убираем класс .dark на body при изменении isDark */
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  /* Скрываем на вложенных страницах и на страницах со своим хедером */
  const isNested = pathname.split('/').filter(Boolean).length > 1;
  const hasOwnHeader = MOBILE_HEADER_HIDDEN.includes(pathname);
  const hiddenOnMobile = isNested || hasOwnHeader;

  return (
    <>
      <header className={`topbar${hiddenOnMobile ? ' topbar--hidden-mobile' : ''}`}>
        <h1 className="topbar__greeting">{PAGE_TITLES[activePage] ?? 'SUITD'}</h1>
        <div className="topbar__actions">
          <button
            className={`icon-btn${isDark ? ' icon-btn--active' : ''}`}
            onClick={() => setIsDark(prev => !prev)}
            aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
          >
            <Icon name={isDark ? 'Sun' : 'Moon'} />
          </button>
          <button
            className={`icon-btn${showNotif ? ' icon-btn--active' : ''}`}
            onClick={() => setShowNotif(true)}
            aria-label="Уведомления"
          >
            <Icon name="Bell" />
          </button>
        </div>
      </header>

      {showNotif && (
        <NotificationsModal onClose={() => setShowNotif(false)} />
      )}
    </>
  );
}
