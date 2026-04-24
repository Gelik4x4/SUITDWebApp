import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import './TeacherScheduleView.css';
import LessonCard from '../schedule/LessonCard';
import DayStrip   from '../schedule/DayStrip';
import Icon from '@icon/Icon';
import { supabase } from '@supabaseClient';

/* ─── Helpers (те же что в SchedulePage) ─────────────────────── */

const RENDER_DAYS = 60;

const RU_DAYS_LONG = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const MONTHS_RU    = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate()+n); return d; };
const weekdayIndex = d => { const w = d.getDay(); return w === 0 ? 6 : w-1; };
const formatDayTitle = d => `${RU_DAYS_LONG[weekdayIndex(d)]}, ${d.getDate()} ${MONTHS_RU[d.getMonth()]}`;
const buildDateList  = () => Array.from({length: RENDER_DAYS}, (_,i) => addDays(today(), i));

const buildWeekStrip = (anchor) => {
  const t = today();
  const mon = addDays(anchor, -weekdayIndex(anchor));
  return Array.from({length:7}, (_,i) => {
    const d = addDays(mon,i);
    return { num: d.getDate(), fullDate: d, isToday: d.toDateString()===t.toDateString(), isPast: d<t };
  });
};

const DAY_KEY = { 'понедельник':0,'вторник':1,'среда':2,'четверг':3,'пятница':4,'суббота':5,'воскресенье':6 };

/* ─── Fetch по имени преподавателя из БД ─────────────────────── */

const fetchTeacherSchedule = async (teacherName) => {
  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .ilike('teacher', `%${teacherName.split(' ').slice(0,2).join('%')}%`)
    .order('time', { ascending: true });

  if (error) throw error;

  const schedule = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
  data.forEach(item => {
    const dayIndex = DAY_KEY[item.day_of_week?.toLowerCase().trim()];
    if (dayIndex === undefined) return;
    schedule[dayIndex].push({
      time: item.time, subject: item.subject,
      teacher: item.teacher, room: item.room, class_type: item.class_type,
    });
  });
  return schedule;
};

/* ─── Scroll helper ───────────────────────────────────────────── */

function scrollToSection(container, target) {
  if (!container || !target) return;
  const offset = container.scrollTop + target.getBoundingClientRect().top - container.getBoundingClientRect().top;
  container.scrollTo({ top: offset, behavior: 'smooth' });
}

/* ─── Day section ─────────────────────────────────────────────── */

function DaySection({ date, lessons, sectionRef }) {
  return (
    <section className="tsv-day-section" data-date={date.toISOString()} ref={sectionRef}>
      <h2 className="tsv-day-title">{formatDayTitle(date)}</h2>
      {lessons.length === 0
        ? <div className="tsv-empty">Нет занятий</div>
        : <div className="tsv-list">{lessons.map((l,i) => <LessonCard key={i} {...l} />)}</div>
      }
    </section>
  );
}

/* ─── Short name helper ───────────────────────────────────────── */

function shortName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  const [last, first, patronymic] = parts;
  return `${last} ${first[0]}.${patronymic ? ' ' + patronymic[0] + '.' : ''}`;
}

/* ─── Component ───────────────────────────────────────────────── */

export default function TeacherScheduleView({ teacher }) {
  const dateList = useRef(buildDateList());
  const [activeDate, setActiveDate] = useState(today());
  const sectionRefs = useRef([]);
  const scrollRef   = useRef(null);
  const isProgrammaticScroll = useRef(false);

  const { data: schedule = {}, isLoading } = useQuery({
    queryKey: ['teacher-schedule', teacher.name],
    queryFn: () => fetchTeacherSchedule(teacher.name),
    staleTime: 5 * 60 * 1000,
  });

  const stripDays      = buildWeekStrip(activeDate);
  const activeDayIndex = weekdayIndex(activeDate);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(entries => {
      if (isProgrammaticScroll.current) return;
      const visible = entries.filter(e => e.isIntersecting)
        .sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveDate(new Date(visible[0].target.dataset.date));
    }, { root, rootMargin: '0px 0px -60% 0px', threshold: 0 });
    sectionRefs.current.forEach(r => r && observer.observe(r));
    return () => observer.disconnect();
  }, [schedule]);

  const handleDayChange = useCallback(i => {
    const d = stripDays[i].fullDate;
    if (d < today()) return;
    setActiveDate(d);
    const idx = dateList.current.findIndex(x => x.toDateString() === d.toDateString());
    if (idx < 0) return;
    isProgrammaticScroll.current = true;
    scrollToSection(scrollRef.current, sectionRefs.current[idx]);
    setTimeout(() => { isProgrammaticScroll.current = false; }, 900);
  }, [stripDays]);

  const handlePrevWeek = () => {
    const p = addDays(activeDate, -7); const t = today();
    setActiveDate(p < t ? t : p);
  };
  const handleNextWeek = () => setActiveDate(addDays(activeDate, 7));
  const handleToday = () => {
    const t = today(); setActiveDate(t);
    const idx = dateList.current.findIndex(x => x.toDateString() === t.toDateString());
    if (idx >= 0) {
      isProgrammaticScroll.current = true;
      scrollToSection(scrollRef.current, sectionRefs.current[idx]);
      setTimeout(() => { isProgrammaticScroll.current = false; }, 900);
    }
  };

  return (
    <div className="tsv">
      {/* Controls */}
      <div className="tsv-controls">
        <div className="tsv-controls__name">
          {shortName(teacher.name)}
          <Icon name="ArrowDown" size={16} />
        </div>
        <div className="tsv-controls__right">
          <div className="sched-nav-group">
            <button className="sched-icon-btn" onClick={handlePrevWeek}><Icon name="ArrowLeft" /></button>
            <button className="sched-icon-btn" onClick={handleToday}>Сегодня</button>
            <button className="sched-icon-btn" onClick={handleNextWeek}><Icon name="ArrowRight" /></button>
          </div>
        </div>
      </div>

      {/* DayStrip */}
      <DayStrip activeDay={activeDayIndex} onDayChange={handleDayChange} days={stripDays} />

      {/* Scroll */}
      <div className="tsv-scroll" ref={scrollRef}>
        {isLoading
          ? <div className="tsv-empty">Загрузка...</div>
          : dateList.current.map((date, i) => (
            <DaySection
              key={date.toISOString()}
              date={date}
              lessons={schedule[weekdayIndex(date)] ?? []}
              sectionRef={el => (sectionRefs.current[i] = el)}
            />
          ))
        }
      </div>
    </div>
  );
}
