import { useState } from 'react';
import './MobileFilterSheet.css';
import Icon from '@icon/Icon';

/*
  Универсальный fullscreen фильтр для мобильной версии.

  Props:
    title:        string            — заголовок (напр. «Фильтры»)
    options:      string[]          — список категорий
    selected:     string[]          — выбранные категории
    onApply:      (string[]) => void
    onClear:      () => void
    onClose:      () => void
    showFav?:     boolean           — показать кнопку «Избранные»
    favActive?:   boolean
    onToggleFav?: () => void
*/
export default function MobileFilterSheet({
  title = 'Фильтры',
  options = [],
  selected = [],
  onApply,
  onClear,
  onClose,
  showFav = false,
  favActive = false,
  onToggleFav,
}) {
  const [pending, setPending] = useState(selected);
  const [pendingFav, setPendingFav] = useState(favActive);

  const toggle = (opt) =>
    setPending(prev =>
      prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt]
    );

  const handleApply = () => {
    onApply(pending, pendingFav);
    onClose();
  };

  const handleClear = () => {
    setPending([]);
    setPendingFav(false);
    onClear();
    onClose();
  };

  return (
    <div className="mfs-overlay">
      <div className="mfs-sheet">

        {/* Header */}
        <div className="mfs-sheet__header">
          <span className="mfs-sheet__title">{title}</span>
          <button className="mfs-sheet__close" onClick={onClose} aria-label="Закрыть">
            <Icon name="Cross" size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="mfs-sheet__body">

          {/* Избранное */}
          {showFav && (
            <button
              className={`mfs-sheet__fav${pendingFav ? ' mfs-sheet__fav--active' : ''}`}
              onClick={() => setPendingFav(v => !v)}
            >
              <span>Избранные</span>
              <Icon name="Heart" size={20} />
            </button>
          )}

          {/* Чекбоксы */}
          {options.map(opt => (
            <label key={opt} className="mfs-sheet__item">
              <input
                type="checkbox"
                className="mfs-sheet__checkbox"
                checked={pending.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="mfs-sheet__actions">
          <button className="mfs-sheet__apply" onClick={handleApply}>
            Применить
          </button>
          <button className="mfs-sheet__clear" onClick={handleClear}>
            Очистить фильтры
          </button>
        </div>

      </div>
    </div>
  );
}
