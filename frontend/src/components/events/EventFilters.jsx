import React from 'react';
import './EventFilters.css';
import { EVENT_DIRECTIONS } from '@constants/eventsData';
import Icon from '@icon/Icon';


function Checkbox({ label, checked, onChange }) {
  return (
    <label className="evf-checkbox">
      <input type="checkbox" className="evf-checkbox__input"
        checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="evf-checkbox__box" />
      <span className="evf-checkbox__label">{label}</span>
    </label>
  );
}

export default function EventFilters({ filters, onChange, onClear }) {
  const toggle = dir => {
    const cur = filters.directions || [];
    const next = cur.includes(dir) ? cur.filter(d => d !== dir) : [...cur, dir];
    onChange({ ...filters, directions: next });
  };

  return (
    <div className="evf-filters">
      <button className="evf-filters__favorites">
        Избранные <Icon name="Heart"/>
      </button>

      <div className="evf-group">
        <div className="evf-group__title">Направление</div>
        <div className="evf-group__list">
          {EVENT_DIRECTIONS.map(d => (
            <Checkbox key={d} label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggle(d)} />
          ))}
        </div>
      </div>

      <button className="evf-filters__clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
