import './InternshipFilters.css';
import { INTERNSHIP_DIRECTIONS, INTERNSHIP_EMPLOYMENT, INTERNSHIP_FORMAT } from './internshipsData';

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="intf-checkbox">
      <input type="checkbox" className="intf-checkbox__input"
        checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="intf-checkbox__box" />
      <span className="intf-checkbox__label">{label}</span>
    </label>
  );
}

export default function InternshipFilters({ filters, onChange, onClear }) {
  const toggle = (key, value) => {
    const cur = filters[key] || [];
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="intf-filters">
      <button className="intf-filters__favorites">
        Избранные <IconHeart />
      </button>

      <div className="intf-group">
        <div className="intf-group__title">Направление</div>
        <div className="intf-group__grid">
          {INTERNSHIP_DIRECTIONS.map(d => (
            <Checkbox key={d} label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggle('directions', d)} />
          ))}
        </div>
      </div>

      <div className="intf-group">
        <div className="intf-group__title">Тип занятости</div>
        <div className="intf-group__grid">
          {INTERNSHIP_EMPLOYMENT.map(e => (
            <Checkbox key={e} label={e}
              checked={(filters.employment || []).includes(e)}
              onChange={() => toggle('employment', e)} />
          ))}
        </div>
      </div>

      <div className="intf-group">
        <div className="intf-group__title">Формат работы</div>
        <div className="intf-group__grid">
          {INTERNSHIP_FORMAT.map(f => (
            <Checkbox key={f} label={f}
              checked={(filters.format || []).includes(f)}
              onChange={() => toggle('format', f)} />
          ))}
        </div>
      </div>

      <button className="intf-filters__clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
