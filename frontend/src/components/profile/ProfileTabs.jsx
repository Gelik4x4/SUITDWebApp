import React from 'react';
import './ProfileTabs.css';

const TABS = [
  { id: 'data',    label: 'Данные' },
  { id: 'settings', label: 'Настройки' },
  { id: 'support', label: 'Техподдержка' },
  { id: 'about',   label: 'О приложении' },
];

export default function ProfileTabs({ active, onChange }) {
  return (
    <div className="profile-tabs">
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
  );
}
