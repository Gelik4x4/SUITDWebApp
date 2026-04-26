import './FilterPanel.css';

/*
  Универсальная панель фильтров с чекбоксами.

  Props:
    groups: [{ title: string, options: string[] }]
    selected: string[]                — массив выбранных значений
    onChange: (selected: string[]) => void
    onClear: () => void
    clearLabel?: string               — текст кнопки сброса
*/

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="fp-checkbox">
      <input
        type="checkbox"
        className="fp-checkbox__input"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="fp-checkbox__box" />
      <span className="fp-checkbox__label">{label}</span>
    </label>
  );
}

export default function FilterPanel({
  groups = [],
  selected = [],
  onChange,
  onClear,
  clearLabel = 'Очистить фильтры',
}) {
  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    onChange(next);
  };

  return (
    <div className="fp">
      {groups.map(group => (
        <div key={group.title} className="fp-group">
          {group.title && (
            <div className="fp-group__title">{group.title}</div>
          )}
          <div className="fp-group__list">
            {group.options.map(opt => (
              <Checkbox
                key={opt}
                label={opt}
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
            ))}
          </div>
        </div>
      ))}

      <button className="fp-clear" onClick={onClear}>
        {clearLabel}
      </button>
    </div>
  );
}
