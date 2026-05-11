import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PAGE_TITLES } from '@constants/navigation';
import './ProfilePage.css';
import ProfileTabs  from '../components/profile/ProfileTabs';
import TabData      from '../components/profile/TabData';
import TabSettings  from '../components/profile/TabSettings';
import TabSupport   from '../components/profile/TabSupport';
import TabAbout     from '../components/profile/TabAbout';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';
import Icon         from '@icon/Icon';
import { LogoutModal } from '../components/layout/Sidebar';
import { supabase } from '@supabaseClient';
import { useQueryClient } from '@tanstack/react-query';

const TAB_LABELS = {
  data:     'Данные',
  settings: 'Настройки',
  support:  'Поддержка',
  about:    'О сервисе',
};

const MENU_ITEMS = [
  { id: 'data',     label: 'Данные'     },
  { id: 'settings', label: 'Настройки'  },
  { id: 'support',  label: 'Поддержка'  },
  { id: 'about',    label: 'О сервисе'  },
];

const getTabComponents = (onBack) => ({
  data:     <TabData />,
  settings: <TabSettings />,
  support:  <TabSupport onBack={onBack} />,
  about:    <TabAbout />,
});

export default function ProfilePage() {
  const [activeTab,    setActiveTab]    = useState('data');
  const [mobileScreen, setMobileScreen] = useState(null);
  const [showLogout,   setShowLogout]   = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const { pathname } = useLocation();
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (mobileScreen) {
      document.body.classList.add('hide-tabbar');
    } else {
      document.body.classList.remove('hide-tabbar');
    }
    return () => document.body.classList.remove('hide-tabbar');
  }, [mobileScreen]);

  const confirmLogout = async () => {
    const { error } = await supabase.auth.signOut();
    queryClient.clear();
    if (!error) navigate('/');
    setShowLogout(false);
  };

  /* ── Mobile: tab content ── */
  if (mobileScreen) {
    const hasOwnHeader = mobileScreen === 'support';
    return (
      <div className="profile-page profile-page--tab">
        {!hasOwnHeader && (
          <MobilePageHeader
            title={TAB_LABELS[mobileScreen]}
            onBack={() => setMobileScreen(null)}
          />
        )}
        <div className="profile-page__tab-content">
          {getTabComponents(() => setMobileScreen(null))[mobileScreen]}
        </div>
      </div>
    );
  }

  /* ── Desktop + Mobile menu screen ── */
  return (
    <div className="profile-page">

      {/* Desktop: tabs + content */}
      <div className="profile-desktop">
        <ProfileTabs active={activeTab} onChange={setActiveTab} />
        <div className="profile-page__content">
          {getTabComponents(null)[activeTab]}
        </div>
      </div>

      {/* Mobile: menu screen */}
      <div className="profile-mobile-menu-screen">
        <div className="profile-mobile-header">
          <h1 className="profile-mobile-header__title">{PAGE_TITLES[pathname] ?? 'Профиль'}</h1>
          <div className="profile-mobile-header__actions">
            <button
              className={`icon-btn${isDark ? ' icon-btn--active' : ''}`}
              onClick={() => setIsDark(prev => !prev)}
              aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
            >
              <Icon name={isDark ? 'Sun' : 'Moon'} size={22} />
            </button>
            <button className="icon-btn" aria-label="Уведомления">
              <Icon name="Bell" size={22} />
            </button>
          </div>
        </div>

        <div className="profile-mobile-menu">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              className="profile-mobile-menu__item"
              onClick={() => setMobileScreen(item.id)}
            >
              <span>{item.label}</span>
              <Icon name="ChevronRight" size={20} className="profile-mobile-menu__chevron" />
            </button>
          ))}
          <button
            className="profile-mobile-menu__item profile-mobile-menu__item--danger"
            onClick={() => setShowLogout(true)}
          >
            <span>Выйти</span>
            <Icon name="ChevronRight" size={20} className="profile-mobile-menu__chevron" />
          </button>
        </div>

        {showLogout && (
          <LogoutModal
            onConfirm={confirmLogout}
            onCancel={() => setShowLogout(false)}
          />
        )}
      </div>

    </div>
  );
}
