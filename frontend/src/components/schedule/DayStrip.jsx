import React from 'react';
import './DayStrip.css';

const IconChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function DayStrip({ activeDay, onDayChange, weekOffset, onWeekNav, days }) {
  return (
    <div className="day-strip">
      <div className="day-strip__list">
        {days.map((d, i) => (
          <button
            key={i}
            className={`day-strip__btn${activeDay === i ? ' day-strip__btn--active' : ''}`}
            onClick={() => onDayChange(i)}
          >
            {DAYS[i]} {d.num}
          </button>
        ))}
      </div>
      <div className="day-strip__nav">
        <button className="sched-icon-btn" onClick={() => onWeekNav(-1)}>
          <IconChevronLeft />
        </button>
        <button className="sched-icon-btn" onClick={() => onWeekNav(1)}>
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}
