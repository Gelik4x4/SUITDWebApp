import React, { useState } from 'react';
import './TabSettings.css';
import Icon from '@icon/Icon';

const COLORS = ['#ffffff', '#f0f0f0', '#e8eeff', '#ffeaea', '#eafff0', '#fff8e1', '#f3e8ff'];


function ColorSwatch({ color, active, onClick }) {
  return (
    <button
      className={`color-swatch${active ? ' color-swatch--active' : ''}`}
      style={{ background: color }}
      onClick={() => onClick(color)}
      title={color}
    >
      {active && <Icon name="Tick" />}
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
        <span className="theme-option__check"><Icon name="Tick" /></span>
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
