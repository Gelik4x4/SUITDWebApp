import React, { useState } from 'react';
import './CalendarModal.css';
import Icon from '@icon/Icon';

const MONTH_NAMES = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];
const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];


function buildMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Дополняем до 42 ячеек (6 строк)
  while (cells.length < 42) cells.push(null);
  return cells;
}

function MonthGrid({ year, month, today }) {
  const cells = buildMonth(year, month);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="cal-month">
      <div className="cal-month__title">
        {MONTH_NAMES[month]} {year}
      </div>
      <div className="cal-grid">
        {DAY_NAMES.map(d => (
          <div key={d} className="cal-grid__head">{d}</div>
        ))}
        {cells.map((day, i) => {
          const isToday =
            day &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
          return (
            <div
              key={i}
              className={`cal-grid__cell${!day ? ' cal-grid__cell--empty' : ''}${isToday ? ' cal-grid__cell--today' : ''}`}
            >
              {day ?? ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarModal({ onClose }) {
  const today = new Date();
  const [offset, setOffset] = useState(0);

  const base = new Date(today.getFullYear(), today.getMonth() + offset * 2, 1);
  const m1Year = base.getFullYear();
  const m1Month = base.getMonth();

  const m2Date = new Date(m1Year, m1Month + 1, 1);
  const m2Year = m2Date.getFullYear();
  const m2Month = m2Date.getMonth();

  const totalMonths = 12;
  const canPrev = offset > -3;
  const canNext = offset < 3;

  return (
    <div className="cal-overlay" onClick={onClose}>
      <div className="cal-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cal-modal__header">
          <span className="cal-modal__title">Календарь</span>
          <button className="cal-close-btn" onClick={onClose}><Icon name="Cross" size={32} /></button>
        </div>

        {/* Two months */}
        <div className="cal-months-row">
          <MonthGrid year={m1Year} month={m1Month} today={today} />
          <div className="cal-months-divider" />
          <MonthGrid year={m2Year} month={m2Month} today={today} />
        </div>

        {/* Navigation sliders */}
        <div className="cal-nav">
          <button
            className={`cal-nav__btn${!canPrev ? ' cal-nav__btn--disabled' : ''}`}
            onClick={() => canPrev && setOffset(o => o - 1)}
          >
           <Icon name="ArrowLeft" />
          </button>
          <button
            className={`cal-nav__btn${!canNext ? ' cal-nav__btn--disabled' : ''}`}
            onClick={() => canNext && setOffset(o => o + 1)}
          >
            <Icon name="ArrowRight" />
          </button>
        </div>
      </div>
    </div>
  );
}
