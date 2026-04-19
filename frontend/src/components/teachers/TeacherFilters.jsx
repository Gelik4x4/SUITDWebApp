import './TeacherFilters.css';
import { INSTITUTES } from '@constants/teachersData';

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="tf-checkbox">
      <input type="checkbox" className="tf-checkbox__input"
        checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="tf-checkbox__box" />
      <span className="tf-checkbox__label">{label}</span>
    </label>
  );
}

export default function TeacherFilters({ filters, onChange, onClear }) {
  const toggle = (inst) => {
    const cur = filters.institutes || [];
    const next = cur.includes(inst) ? cur.filter(i => i !== inst) : [...cur, inst];
    onChange({ ...filters, institutes: next });
  };

  return (
    <div className="tf-filters">
      <div className="tf-group">
        <div className="tf-group__title">Институт</div>
        <div className="tf-group__list">
          {INSTITUTES.map(inst => (
            <Checkbox key={inst} label={inst}
              checked={(filters.institutes || []).includes(inst)}
              onChange={() => toggle(inst)} />
          ))}
        </div>
      </div>
      <button className="tf-filters__clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
