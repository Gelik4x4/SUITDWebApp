import './VacancyFilters.css';
import { DIRECTIONS, EXPERIENCE_OPTIONS, EMPLOYMENT_OPTIONS, FORMAT_OPTIONS } from '@constants/vacanciesData';
import Icon from '@icon/Icon';



function Checkbox({ label, checked, onChange }) {
  return (
    <label className="vac-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="vac-checkbox__input"
      />
      <span className="vac-checkbox__box" />
      <span className="vac-checkbox__label">{label}</span>
    </label>
  );
}

export default function VacancyFilters({ filters, onChange, onClear }) {
  const toggle = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="vac-filters">
      {/* Избранные */}
      <button className="vac-filters__favorites">
        Избранные <Icon name="Heart"/>
      </button>

      {/* Направление */}
      <div className="vac-filter-group">
        <div className="vac-filter-group__title">Направление</div>
        <div className="vac-filter-group__grid">
          {DIRECTIONS.map(d => (
            <Checkbox
              key={d}
              label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggle('directions', d)}
            />
          ))}
        </div>
      </div>

      {/* Опыт */}
      <div className="vac-filter-group">
        <div className="vac-filter-group__title">Опыт</div>
        <div className="vac-filter-group__grid">
          {EXPERIENCE_OPTIONS.map(e => (
            <Checkbox
              key={e}
              label={e}
              checked={(filters.experience || []).includes(e)}
              onChange={() => toggle('experience', e)}
            />
          ))}
        </div>
      </div>

      {/* Тип занятости */}
      <div className="vac-filter-group">
        <div className="vac-filter-group__title">Тип занятости</div>
        <div className="vac-filter-group__grid">
          {EMPLOYMENT_OPTIONS.map(e => (
            <Checkbox
              key={e}
              label={e}
              checked={(filters.employment || []).includes(e)}
              onChange={() => toggle('employment', e)}
            />
          ))}
        </div>
      </div>

      {/* Формат работы */}
      <div className="vac-filter-group">
        <div className="vac-filter-group__title">Формат работы</div>
        <div className="vac-filter-group__grid">
          {FORMAT_OPTIONS.map(f => (
            <Checkbox
              key={f}
              label={f}
              checked={(filters.format || []).includes(f)}
              onChange={() => toggle('format', f)}
            />
          ))}
        </div>
      </div>

      {/* Очистить */}
      <button className="vac-filters__clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
