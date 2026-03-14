import React from 'react';
import './NewsFilters.css';
import { NEWS_DIRECTIONS } from './newsData';

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="nf-checkbox">
      <input
        type="checkbox"
        className="nf-checkbox__input"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="nf-checkbox__box" />
      <span className="nf-checkbox__label">{label}</span>
    </label>
  );
}

export default function NewsFilters({ filters, onChange, onClear }) {
  const toggle = (dir) => {
    const cur = filters.directions || [];
    const next = cur.includes(dir) ? cur.filter(d => d !== dir) : [...cur, dir];
    onChange({ ...filters, directions: next });
  };

  return (
    <div className="news-filters">
      {/* Направление */}
      <div className="nf-group">
        <div className="nf-group__title">Направление</div>
        <div className="nf-group__grid">
          {NEWS_DIRECTIONS.map(d => (
            <Checkbox
              key={d}
              label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggle(d)}
            />
          ))}
        </div>
      </div>

      {/* Очистить */}
      <button className="nf-clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
