import './VacancyFilterPanel.css';
import Icon from '@icon/Icon';

/*
  Специализированная панель фильтров для вакансий с группами и заголовками.
  Использует тот же стиль чекбоксов что и FilterPanel.
*/

function CheckGroup({ title, options, selected, onChange }) {
  const toggle = opt => {
    const next = selected.includes(opt)
      ? selected.filter(v => v !== opt)
      : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="vfp-group">
      <div className="vfp-group__title">{title}</div>
      <div className="vfp-group__grid">
        {options.map(opt => (
          <label key={opt} className="vfp-checkbox">
            <input
              type="checkbox"
              className="vfp-checkbox__input"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span className="vfp-checkbox__box" />
            <span className="vfp-checkbox__label">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function VacancyFilterPanel({
  showFav, onToggleFav,
  expOptions, expSelected, onExpChange,
  empOptions, empSelected, onEmpChange,
  fmtOptions, fmtSelected, onFmtChange,
  dirOptions, dirSelected, onDirChange,
  onClear,
}) {
  return (
    <div className="vfp">
      {/* Избранное */}
      <button
        className={`vfp-fav${showFav ? ' vfp-fav--active' : ''}`}
        onClick={onToggleFav}
      >
        <span>Избранные</span>
        <Icon name="Heart" size={16} />
      </button>

      <CheckGroup title="Опыт"           options={expOptions} selected={expSelected} onChange={onExpChange} />
      <CheckGroup title="Тип занятости"  options={empOptions} selected={empSelected} onChange={onEmpChange} />
      <CheckGroup title="Формат работы"  options={fmtOptions} selected={fmtSelected} onChange={onFmtChange} />
      <CheckGroup title="Направление"    options={dirOptions} selected={dirSelected} onChange={onDirChange} />

      <button className="vfp-clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
