import React from 'react';
import './ProfileTabs.css';

const TABS = [
  { id: 'data',     label: 'Данные'     },
  { id: 'settings', label: 'Настройки'  },
  { id: 'support',  label: 'Поддержка'  },
  { id: 'about',    label: 'О сервисе'  },
];

export default function ProfileTabs({ active, onChange }) {
  return (
    <div className="profile-tabs">
       <div className="profile-tabs__wrapper">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`profile-tabs__btn${active === t.id ? ' profile-tabs__btn--active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
    </div>
  );
}
