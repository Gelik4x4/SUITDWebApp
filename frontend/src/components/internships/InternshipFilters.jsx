import './InternshipFilters.css';
import { INTERNSHIP_DIRECTIONS, INTERNSHIP_EMPLOYMENT, INTERNSHIP_FORMAT } from '@constants/internshipsData';
import Icon from '@icon/Icon';


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
        Избранные <Icon name="Heart"/>
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
