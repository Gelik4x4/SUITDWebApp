import React, { useState } from 'react';
import './TabSettings.css';

const COLORS = ['#ffffff', '#f0f0f0', '#e8eeff', '#ffeaea', '#eafff0', '#fff8e1', '#f3e8ff'];

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function ColorSwatch({ color, active, onClick }) {
  return (
    <button
      className={`color-swatch${active ? ' color-swatch--active' : ''}`}
      style={{ background: color }}
      onClick={() => onClick(color)}
      title={color}
    >
      {active && <IconCheck />}
    </button>
  );
}

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
        <span className="theme-option__check"><IconCheck /></span>
      )}
    </button>
  );
}

export default function TabSettings() {
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [theme,       setTheme]       = useState('system');
  const [notify,      setNotify]      = useState(true);

  return (
    <div className="tab-settings">

      {/* Основной цвет */}
      <section className="settings-section">
        <h3 className="settings-section__title">Основной цвет</h3>
        <div className="color-swatches">
          {COLORS.map(c => (
            <ColorSwatch key={c} color={c} active={activeColor === c} onClick={setActiveColor} />
          ))}
        </div>
      </section>

      {/* Внешний вид */}
      <section className="settings-section">
        <h3 className="settings-section__title">Внешний вид</h3>
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
        <button className="btn btn--ghost">Отмена</button>
        <button className="btn btn--primary">Сохранить</button>
      </div>

    </div>
  );
}
