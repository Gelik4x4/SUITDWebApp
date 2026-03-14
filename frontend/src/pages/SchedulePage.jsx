import  { useState } from 'react';
import './SchedulePage.css';
import GroupSelector  from '../components/schedule/GroupSelector';
import ViewToggle     from '../components/schedule/ViewToggle';
import DayStrip       from '../components/schedule/DayStrip';
import LessonCard     from '../components/schedule/LessonCard';
import BreakRow       from '../components/schedule/BreakRow';
import CalendarModal  from '../components/schedule/CalendarModal';

// ── Calendar icon ────────────────────────────────────────────────────────────
const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
    <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
);

// ── Schedule data ─────────────────────────────────────────────────────────────
function getWeekDays(weekOffset) {
  // Anchor: Monday of current week + offset
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // Mon=0
  const mon = new Date(now);
  mon.setDate(now.getDate() - dow + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return { num: d.getDate() };
  });
}

const SCHEDULE_DATA = {
  0: [
    { type: 'lesson', num: 1, time: '10:05 – 11:30', subject: 'Прикладной дизайн', teacher: 'Сошникова И.А.', room: 'В 484', tag: 'Лек', tagColor: 'purple' },
    { type: 'lesson', num: 2, time: '11:40 – 13:05', subject: 'Прикладной дизайн', teacher: 'Сошникова И.А.', room: 'В 484', tag: 'Лек', tagColor: 'purple' },
    { type: 'break',  time: '13:05 – 13:45', label: 'Обед' },
    { type: 'lesson', num: 3, time: '13:45 – 15:10', subject: 'Прикладной дизайн', teacher: 'Сошникова И.А.', room: 'В 484', tag: 'Лек', tagColor: 'purple' },
  ],
  1: [
    { type: 'lesson', num: 1, time: '09:00 – 10:30', subject: 'Типографика', teacher: 'Иванов В.С.', room: 'А 201', tag: 'Пр', tagColor: 'blue' },
  ],
  2: [], 3: [], 4: [], 5: [], 6: [],
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [activeDay,    setActiveDay]    = useState(0);
  const [viewMode,     setViewMode]     = useState('day');
  const [weekOffset,   setWeekOffset]   = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const days  = getWeekDays(weekOffset);
  const items = SCHEDULE_DATA[activeDay] ?? [];

  return (
    <>
      <div className="sched-page">
        {/* ── Controls ── */}
        <div className="sched-controls">
          <GroupSelector group="4-МД-5" />
          <div className="sched-controls__right">
            <ViewToggle value={viewMode} onChange={setViewMode} />
            <button className="sched-icon-btn" onClick={() => setCalendarOpen(true)}>
              <IconCalendar />
            </button>
          </div>
        </div>

        {/* ── Day strip ── */}
        <DayStrip
          activeDay={activeDay}
          onDayChange={setActiveDay}
          weekOffset={weekOffset}
          onWeekNav={dir => setWeekOffset(o => o + dir)}
          days={days}
        />

        {/* ── Lesson list ── */}
        <div className="sched-list">
          {items.length === 0 ? (
            <div className="sched-empty">Занятий нет</div>
          ) : (
            items.map((item, i) =>
              item.type === 'break'
                ? <BreakRow  key={i} time={item.time} label={item.label} />
                : <LessonCard key={i} {...item} />
            )
          )}
        </div>
      </div>

      {/* ── Calendar modal ── */}
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
    </>
  );
}
