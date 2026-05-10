import { useState } from 'react';
import './MobileVacancyFilter.css';
import Icon from '@icon/Icon';

/*
  Мобильный fullscreen фильтр для вакансий.
  Группированные чекбоксы в 2 колонки + кнопка «Избранные».
*/

function CheckGroup({ title, options, selected, onChange }) {
  const toggle = (opt) => {
    const next = selected.includes(opt)
      ? selected.filter(v => v !== opt)
      : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="mvf-group">
      <div className="mvf-group__title">{title}</div>
      <div className="mvf-group__grid">
        {options.map(opt => (
          <label key={opt} className="mvf-checkbox">
            <input
              type="checkbox"
              className="mvf-checkbox__input"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span className="mvf-checkbox__box" />
            <span className="mvf-checkbox__label">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function MobileVacancyFilter({
  onClose,
  showFav, favActive,
  expOptions, expSelected,
  empOptions, empSelected,
  fmtOptions, fmtSelected,
  dirOptions, dirSelected,
  onApply,
  onClear,
}) {
  const [pFav, setPFav] = useState(favActive);
  const [pExp, setPExp] = useState(expSelected);
  const [pEmp, setPEmp] = useState(empSelected);
  const [pFmt, setPFmt] = useState(fmtSelected);
  const [pDir, setPDir] = useState(dirSelected);

  const handleApply = () => {
    onApply({ fav: pFav, exp: pExp, emp: pEmp, fmt: pFmt, dir: pDir });
    onClose();
  };

  const handleClear = () => {
    setPFav(false); setPExp([]); setPEmp([]); setPFmt([]); setPDir([]);
    onClear();
    onClose();
  };

  return (
    <div className="mvf-overlay">
      <div className="mvf-sheet">

        {/* Header */}
        <div className="mvf-sheet__header">
          <span className="mvf-sheet__title">Фильтры</span>
          <button className="mvf-sheet__close" onClick={onClose} aria-label="Закрыть">
            <Icon name="Cross" size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="mvf-sheet__body">

          {/* Избранное */}
          <button
            className={`mvf-fav${pFav ? ' mvf-fav--active' : ''}`}
            onClick={() => setPFav(v => !v)}
          >
            <span>Избранные</span>
            <Icon name="Heart" size={20} />
          </button>

          <CheckGroup title="Опыт"          options={expOptions} selected={pExp} onChange={setPExp} />
          <CheckGroup title="Тип занятости" options={empOptions} selected={pEmp} onChange={setPEmp} />
          <CheckGroup title="Формат работы" options={fmtOptions} selected={pFmt} onChange={setPFmt} />
          <CheckGroup title="Направление"   options={dirOptions} selected={pDir} onChange={setPDir} />
        </div>

        {/* Actions */}
        <div className="mvf-sheet__actions">
          <button className="mvf-sheet__apply" onClick={handleApply}>Применить</button>
          <button className="mvf-sheet__clear" onClick={handleClear}>Очистить фильтры</button>
        </div>

      </div>
    </div>
  );
}
