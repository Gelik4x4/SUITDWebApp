import { useRef } from 'react';
import './DayStrip.css';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const SWIPE_THRESHOLD = 50;

export default function DayStrip({ activeDay, onDayChange, days, onPrevWeek, onNextWeek }) {
  const listRef = useRef(null);
  const dragState = useRef(null);

  /* ── Touch/mouse swipe для переключения недели ── */
  const onPointerDown = (e) => {
    dragState.current = { startX: e.clientX, moved: false };
    listRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current) return;
    if (Math.abs(e.clientX - dragState.current.startX) > 5) {
      dragState.current.moved = true;
    }
  };

  const onPointerUp = (e) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx < 0) onNextWeek?.();
      else onPrevWeek?.();
    }
    dragState.current = null;
  };

  return (
    <div className="day-strip">
      <div
        className="day-strip__list"
        ref={listRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
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
            <span className="day-strip__label">{DAYS[i]}</span>{" "}<span className="day-strip__num">{d.num}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
