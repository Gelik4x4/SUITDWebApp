import './DayStrip.css';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function DayStrip({ activeDay, onDayChange, days }) {
  return (
    <div className="day-strip">
      <div className="day-strip__list">
        {days.map((d, i) => (
          <button
            key={i}
            className={[
              'day-strip__btn',
              activeDay === i ? 'day-strip__btn--active' : '',
              d.isPast ? 'day-strip__btn--past' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => !d.isPast && onDayChange(i)}
            disabled={d.isPast}
          >
            {DAYS[i]} {d.num}
          </button>
        ))}
      </div>
    </div>
  );
}
