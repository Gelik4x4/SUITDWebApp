import './FavFilterPanel.css';
import Icon from '@icon/Icon';

/*
  Универсальная панель фильтров с кнопкой Избранное.

  Props:
    options:      string[]          — список категорий
    selected:     string[]          — выбранные категории
    onChange:     (string[]) => void
    showFav:      boolean           — показывать только избранное
    onToggleFav:  () => void
    onClear:      () => void
    clearLabel?:  string
*/
export default function FavFilterPanel({
  options = [],
  selected = [],
  onChange,
  showFav = false,
  onToggleFav,
  onClear,
  clearLabel = 'Очистить фильтры',
}) {
  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter(v => v !== opt)
      : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="ffp">
      {/* Избранное */}
      <button
        className={`ffp-fav${showFav ? ' ffp-fav--active' : ''}`}
        onClick={onToggleFav}
      >
        <span>Избранные</span>
        <Icon name="Heart" size={24} />
      </button>

      {/* Чекбоксы */}
      <div className="ffp-list">
        {options.map(opt => (
          <label key={opt} className="ffp-checkbox">
            <input
              type="checkbox"
              className="ffp-checkbox__input"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span className="ffp-checkbox__box" />
            <span className="ffp-checkbox__label">{opt}</span>
          </label>
        ))}
      </div>

      {/* Очистить */}
      <button className="ffp-clear" onClick={onClear}>
        {clearLabel}
      </button>
    </div>
  );
}
