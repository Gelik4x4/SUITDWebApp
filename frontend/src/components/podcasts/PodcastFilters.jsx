import React from 'react';
import './PodcastFilters.css';
import { PODCAST_DIRECTIONS } from '@constants/podcastsData';
import Icon from '@icon/Icon';


function Checkbox({ label, checked, onChange }) {
  return (
    <label className="pf-checkbox">
      <input type="checkbox" className="pf-checkbox__input"
        checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="pf-checkbox__box" />
      <span className="pf-checkbox__label">{label}</span>
    </label>
  );
}

export default function PodcastFilters({ filters, onChange, onClear }) {
  const toggle = dir => {
    const cur = filters.directions || [];
    const next = cur.includes(dir) ? cur.filter(d => d !== dir) : [...cur, dir];
    onChange({ ...filters, directions: next });
  };

  return (
    <div className="pf-filters">
      <button className="pf-filters__favorites">
        Избранные <Icon name="Heart"/>
      </button>
      <div className="pf-group">
        <div className="pf-group__title">Направление</div>
        <div className="pf-group__grid">
          {PODCAST_DIRECTIONS.map(d => (
            <Checkbox key={d} label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggle(d)} />
          ))}
        </div>
      </div>
      <button className="pf-filters__clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
