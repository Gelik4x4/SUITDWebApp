import React, { useState } from 'react';
import './TabSettings.css';
import Icon from '@icon/Icon';

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`toggle${checked ? ' toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="toggle__thumb" />
    </button>
  );
}

function ThemeOption({ label, active, onClick }) {
  return (
    <button
      className={`theme-option${active ? ' theme-option--active' : ''}`}
      onClick={onClick}
    >
      {label}
      {active && (
        <span className="theme-option__check"><Icon name="Tick" /></span>
      )}
    </button>
  );
}

export default function TabSettings() {
  const [theme,  setTheme]  = useState('system');
  const [notify, setNotify] = useState(true);

  return (
    <div className="tab-settings">

      {/* Внешний вид приложения */}
      <section className="settings-section">
        <h3 className="settings-section__title">Внешний вид приложения</h3>
        <div className="theme-options">
          <ThemeOption label="Системная тема" active={theme === 'system'} onClick={() => setTheme('system')} />
          <ThemeOption label="Светлая тема"   active={theme === 'light'}  onClick={() => setTheme('light')} />
          <ThemeOption label="Тёмная тема"    active={theme === 'dark'}   onClick={() => setTheme('dark')} />
        </div>
      </section>

      {/* Уведомления */}
      <section className="settings-section">
        <h3 className="settings-section__title">Уведомления</h3>
        <div className="settings-row">
          <span className="settings-row__label">За 20 минут до начала пары</span>
          <Toggle checked={notify} onChange={setNotify} />
        </div>
      </section>

      {/* Кнопки */}
      <div className="settings-actions">
        <button className="btn btn--primary">Сохранить</button>
        <button className="btn btn--outline">Отмена</button>
      </div>

    </div>
  );
}
