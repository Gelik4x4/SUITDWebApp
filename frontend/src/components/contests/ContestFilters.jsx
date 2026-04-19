import React from 'react';
import './ContestFilters.css';
import { CONTEST_DIRECTIONS } from '@constants/contestsData';
import Icon from '@icon/Icon';


function Checkbox({ label, checked, onChange }) {
  return (
    <label className="con-checkbox">
      <input type="checkbox" className="con-checkbox__input"
        checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="con-checkbox__box" />
      <span className="con-checkbox__label">{label}</span>
    </label>
  );
}

export default function ContestFilters({ filters, onChange, onClear }) {
  const toggleDirection = (dir) => {
    const cur = filters.directions || [];
    const next = cur.includes(dir) ? cur.filter(d => d !== dir) : [...cur, dir];
    onChange({ ...filters, directions: next });
  };

  return (
    <div className="con-filters">
      {/* Избранные */}
      <button className="con-filters__favorites">
        Избранные  <Icon name="Heart"/>
      </button>

      {/* Статус */}
      <div className="con-filters__status">
        <button
          className={`con-filters__status-btn${filters.status === 'active' ? ' con-filters__status-btn--active' : ''}`}
          onClick={() => onChange({ ...filters, status: filters.status === 'active' ? null : 'active' })}
        >
          Приём заявок
        </button>
        <button
          className={`con-filters__status-btn${filters.status === 'finished' ? ' con-filters__status-btn--active' : ''}`}
          onClick={() => onChange({ ...filters, status: filters.status === 'finished' ? null : 'finished' })}
        >
          Завершённые
        </button>
      </div>

      {/* Направление */}
      <div className="con-filter-group">
        <div className="con-filter-group__title">Направление</div>
        <div className="con-filter-group__list">
          {CONTEST_DIRECTIONS.map(d => (
            <Checkbox
              key={d}
              label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggleDirection(d)}
            />
          ))}
        </div>
      </div>

      {/* Очистить */}
      <button className="con-filters__clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
