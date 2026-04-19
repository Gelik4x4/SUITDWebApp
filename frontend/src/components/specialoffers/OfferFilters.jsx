import './OfferFilters.css';
import { OFFER_DIRECTIONS } from '@constants/specialOffersData';
import Icon from '@icon/Icon';


function Checkbox({ label, checked, onChange }) {
  return (
    <label className="of-checkbox">
      <input type="checkbox" className="of-checkbox__input"
        checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="of-checkbox__box" />
      <span className="of-checkbox__label">{label}</span>
    </label>
  );
}

export default function OfferFilters({ filters, onChange, onClear }) {
  const toggle = (dir) => {
    const cur = filters.directions || [];
    const next = cur.includes(dir) ? cur.filter(d => d !== dir) : [...cur, dir];
    onChange({ ...filters, directions: next });
  };

  return (
    <div className="of-filters">
      <button className="of-filters__favorites">
        Избранные <Icon name="Heart"/>
      </button>

      <div className="of-group">
        <div className="of-group__title">Направление</div>
        <div className="of-group__grid">
          {OFFER_DIRECTIONS.map(d => (
            <Checkbox key={d} label={d}
              checked={(filters.directions || []).includes(d)}
              onChange={() => toggle(d)} />
          ))}
        </div>
      </div>

      <button className="of-filters__clear" onClick={onClear}>
        Очистить фильтры
      </button>
    </div>
  );
}
