import './ViewToggle.css';

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle__btn${value === 'day' ? ' view-toggle__btn--active' : ''}`}
        onClick={() => onChange('day')}
      >
        День
      </button>
      <button
        className={`view-toggle__btn${value === 'week' ? ' view-toggle__btn--active' : ''}`}
        onClick={() => onChange('week')}
      >
        Неделя
      </button>
    </div>
  );
}
