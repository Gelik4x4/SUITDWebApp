import Icon from '@icon/Icon';
import s from './ArticleFilters.module.css';

import { ARTICLE_DIRECTIONS } from '@constants/articlesData';


function Checkbox({ label, checked, onChange }) {
  return (
    <label className={s.artfCheckbox}>
      <input 
        type="checkbox" 
        className={s.artfCheckboxInput}
        checked={checked} 
        onChange={e => onChange(e.target.checked)} 
      />
      <span className={s.artfCheckboxBox} />
      <span className={s.artfCheckboxLabel}>{label}</span>
    </label>
  );
}

function ArticleFilters({ filters, onChange, onClear }) {
  const toggle = (dir) => {
    const cur = filters.directions || [];
    const next = cur.includes(dir) ? cur.filter(d => d !== dir) : [...cur, dir];
    onChange({ ...filters, directions: next });
  };

  return (
    <div className={s.artfFilters}>
      <button className={s.artfFiltersFavorites}>
        Избранные 
        <Icon name="Heart" />
      </button>

      <div className={s.artfGroup}>
        <div className={s.artfGroupTitle}>Направление</div>
        <div className={s.artfGroupGrid}>
          {ARTICLE_DIRECTIONS.map(d => (
            <Checkbox key={d} label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggle(d)} />
          ))}
        </div>
      </div>

      <button className={s.artfFiltersClear} onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}

export default ArticleFilters;
