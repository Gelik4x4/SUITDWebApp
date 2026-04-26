import React, { useState } from 'react';
import './CalendarModal.css';
import Icon from '@icon/Icon';

const MONTH_NAMES = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];
const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

const weekdayIndex = (date) => {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
};

function buildMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = weekdayIndex(firstDay);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const lessonColors = {
  'Лек': { bg: '#ede9ff', text: '#6B5CE7' },
  'Пр':  { bg: '#fff0e0', text: '#e07b00' },
  'Лаб': { bg: '#e0eeff', text: '#3a7bd5' },
};
const defaultColor = { bg: '#f0f0f0', text: '#666' };

function getLessonColor(classType) {
  if (!classType) return defaultColor;
  return lessonColors[classType.trim()] ?? defaultColor;
}

function LessonChip({ subject, class_type }) {
  const { bg, text } = getLessonColor(class_type);
  return (
    <div className="cal-chip" style={{ background: bg, color: text }} title={subject}>
      {subject}
    </div>
  );
}

function DayCell({ day, year, month, schedule, isToday, isPast }) {
  const lessons = day
    ? schedule[weekdayIndex(new Date(year, month, day))] ?? []
    : [];

  return (
    <div className={[
      'cal-cell',
      !day ? 'cal-cell--empty' : '',
      isToday ? 'cal-cell--today' : '',
      isPast ? 'cal-cell--past' : '',
    ].filter(Boolean).join(' ')}>
      {day && (
        <>
          <span className="cal-cell__num">{day}</span>
          <div className="cal-cell__lessons">
            {lessons.map((l, i) => (
              <LessonChip key={i} subject={l.subject} class_type={l.class_type} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CalendarModal({ onClose, schedule = {} }) {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const [offset, setOffset] = useState(0);

  const viewDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + offset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const cells = buildMonth(year, month);
  const canPrev = offset > 0;
  const canNext = offset < 11;

  return (
    <div className="cal-overlay" onClick={onClose}>
      <div className="cal-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="cal-modal__header">
          <span className="cal-modal__title">{MONTH_NAMES[month]}</span>
          <button className="cal-close-btn" onClick={onClose}>
            <Icon name="Cross" size={24} />
          </button>
        </div>

        {/* Grid wrapper — растягивается на всё доступное место */}
        <div className="cal-grid-wrap">
          <div className="cal-grid">
            {/* Заголовки дней */}
            {DAY_NAMES.map(d => (
              <div key={d} className="cal-grid__head">{d}</div>
            ))}

            {/* Ячейки дней */}
            {cells.map((day, i) => {
              const cellDate = day ? new Date(year, month, day) : null;
              const isToday = cellDate?.toDateString() === todayDate.toDateString();
              const isPast = cellDate && cellDate < todayDate && !isToday;
              return (
                <DayCell
                  key={i}
                  day={day}
                  year={year}
                  month={month}
                  schedule={schedule}
                  isToday={isToday}
                  isPast={isPast}
                />
              );
            })}
          </div>
        </div>

        {/* Navigation */}
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
