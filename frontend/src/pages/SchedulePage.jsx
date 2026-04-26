import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import './SchedulePage.css';
import GroupSelector from '../components/schedule/GroupSelector';
import DayStrip from '../components/schedule/DayStrip';
import LessonCard from '../components/schedule/LessonCard';
import CalendarModal from '../components/schedule/CalendarModal';
import GroupSelectorModal from '../components/schedule/GroupSelectorModal';
import Icon from '@icon/Icon';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import { supabase } from '@supabaseClient';

/* ─── Constants ───────────────────────────────────────────────── */

const RENDER_DAYS = 60;

const RU_DAYS_LONG = [
  'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота', 'Воскресенье',
];

const MONTHS_RU = [
  'января','февраля','марта','апреля','мая','июня',
  'июля','августа','сентября','октября','ноября','декабря',
];

/* ─── Helpers ─────────────────────────────────────────────────── */

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const weekdayIndex = (date) => {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
};

const formatDayTitle = (date) =>
  `${RU_DAYS_LONG[weekdayIndex(date)]}, ${date.getDate()} ${MONTHS_RU[date.getMonth()]}`;

const buildDateList = () => {
  const start = today();
  return Array.from({ length: RENDER_DAYS }, (_, i) => addDays(start, i));
};

const buildWeekStrip = (anchorDate) => {
  const todayDate = today();
  const wi = weekdayIndex(anchorDate);
  const monday = addDays(anchorDate, -wi);
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    return {
      num: d.getDate(),
      fullDate: d,
      isToday: d.toDateString() === todayDate.toDateString(),
      isPast: d < todayDate,
    };
  });
};

/* ─── Data fetching ───────────────────────────────────────────── */

const DAY_KEY = {
  'понедельник': 0, 'вторник': 1, 'среда': 2,
  'четверг': 3, 'пятница': 4, 'суббота': 5, 'воскресенье': 6,
};

/* Получаем расписание для конкретной группы по её названию */
const fetchScheduleByGroupName = async (groupName) => {
  /* 1. Найти group_id по названию */
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('id')
    .eq('name', groupName)
    .single();
  if (groupError) throw groupError;

  /* 2. Получить расписание */
  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('group_id', groupData.id)
    .order('time', { ascending: true });
  if (error) throw error;

  const schedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  data.forEach((item) => {
    const dayIndex = DAY_KEY[item.day_of_week.toLowerCase().trim()];
    if (dayIndex === undefined) return;
    if (!item.week_type.includes('числ')) return;
    schedule[dayIndex].push({
      time: item.time,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
      class_type: item.class_type,
    });
  });

  return schedule;
};

/* Получаем своё расписание + имя группы */
const fetchMySchedule = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Пользователь не авторизован');

  const { data: userData } = await supabase
    .from('users')
    .select('group_id, groups(name)')
    .eq('id', user.id)
    .single();

  if (!userData?.group_id) return { schedule: {}, groupName: 'Нет группы' };

  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('group_id', userData.group_id)
    .order('time', { ascending: true });

  if (error) throw error;

  const schedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  data.forEach((item) => {
    const dayIndex = DAY_KEY[item.day_of_week.toLowerCase().trim()];
    if (dayIndex === undefined) return;
    if (!item.week_type.includes('числ')) return;
    schedule[dayIndex].push({
      time: item.time,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
      class_type: item.class_type,
    });
  });

  return { schedule, groupName: userData.groups?.name };
};

/* ─── Scroll helper ───────────────────────────────────────────── */

function scrollToSection(container, target) {
  if (!container || !target) return;
  const containerTop = container.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  const newScrollTop = container.scrollTop + (targetTop - containerTop);
  container.scrollTo({ top: newScrollTop, behavior: 'smooth' });
}

/* ─── Day section ─────────────────────────────────────────────── */

function DaySection({ date, lessons, sectionRef }) {
  return (
    <section
      className="sched-day-section"
      data-date={date.toISOString()}
      ref={sectionRef}
    >
      <h2 className="sched-day-title">{formatDayTitle(date)}</h2>
      {lessons.length === 0 ? (
        <div className="sched-empty">Нет событий</div>
      ) : (
        <div className="sched-list">
          {lessons.map((item, i) => (
            <LessonCard key={i} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Inner schedule view (переиспользуем для своей и чужой группы) ── */

function ScheduleView({ schedule, groupName, onGroupClick, onCalendarClick }) {
  const dateList = useRef(buildDateList());
  const [activeDate, setActiveDate] = useState(today());
  const sectionRefs = useRef([]);
  const scrollRef = useRef(null);
  const isProgrammaticScroll = useRef(false);

  const stripDays = buildWeekStrip(activeDate);
  const activeDayIndex = weekdayIndex(activeDate);

  useEffect(() => {
    const scrollRoot = scrollRef.current;
    if (!scrollRoot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const iso = visible[0].target.dataset.date;
          if (iso) setActiveDate(new Date(iso));
        }
      },
      { root: scrollRoot, rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    sectionRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [schedule]);

  const handleDayChange = useCallback((dayIndex) => {
    const targetDate = stripDays[dayIndex].fullDate;
    if (targetDate < today()) return;
    setActiveDate(targetDate);
    const sectionIndex = dateList.current.findIndex(
      d => d.toDateString() === targetDate.toDateString()
    );
    if (sectionIndex < 0) return;
    const target = sectionRefs.current[sectionIndex];
    if (!target) return;
    isProgrammaticScroll.current = true;
    scrollToSection(scrollRef.current, target);
    setTimeout(() => { isProgrammaticScroll.current = false; }, 900);
  }, [stripDays]);

  const handlePrevWeek = () => {
    const prev = addDays(activeDate, -7);
    const todayDate = today();
    setActiveDate(prev < todayDate ? todayDate : prev);
  };

  const handleNextWeek = () => setActiveDate(addDays(activeDate, 7));

  const handleToday = () => {
    const todayDate = today();
    setActiveDate(todayDate);
    const idx = dateList.current.findIndex(
      d => d.toDateString() === todayDate.toDateString()
    );
    if (idx >= 0) {
      isProgrammaticScroll.current = true;
      scrollToSection(scrollRef.current, sectionRefs.current[idx]);
      setTimeout(() => { isProgrammaticScroll.current = false; }, 900);
    }
  };

  return (
    <>
      {/* Controls */}
      <div className="sched-controls">
        <div onClick={onGroupClick} style={{ cursor: 'pointer' }}>
          <GroupSelector group={groupName} />
        </div>
        <div className="sched-controls__right">
          <div className="sched-nav-group">
            <button className="sched-icon-btn" onClick={onCalendarClick}>
              <Icon name="Calendar" />
            </button>
          </div>
          <div className="sched-nav-group">
            <button className="sched-icon-btn" onClick={handlePrevWeek}>
              <Icon name="ArrowLeft" />
            </button>
            <button className="sched-icon-btn" onClick={handleToday}>
              Сегодня
            </button>
            <button className="sched-icon-btn" onClick={handleNextWeek}>
              <Icon name="ArrowRight" />
            </button>
          </div>
        </div>
      </div>

      {/* DayStrip */}
      <DayStrip
        activeDay={activeDayIndex}
        onDayChange={handleDayChange}
        days={stripDays}
      />

      {/* Scroll area */}
      <div className="sched-scroll" ref={scrollRef}>
        {dateList.current.map((date, i) => (
          <DaySection
            key={date.toISOString()}
            date={date}
            lessons={schedule[weekdayIndex(date)] ?? []}
            sectionRef={el => (sectionRefs.current[i] = el)}
          />
        ))}
      </div>
    </>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function SchedulePage() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  /* null = смотрим свою группу; string = название выбранной чужой группы */
  const [viewingGroup, setViewingGroup] = useState(null);

  /* Своё расписание */
  const { data: myData, isLoading: myLoading, error: myError } = useQuery({
    queryKey: ['mySchedule'],
    queryFn: fetchMySchedule,
    staleTime: 5 * 60 * 1000,
  });

  /* Расписание выбранной группы (только когда viewingGroup !== null) */
  const { data: otherSchedule, isLoading: otherLoading } = useQuery({
    queryKey: ['scheduleByGroup', viewingGroup],
    queryFn: () => fetchScheduleByGroupName(viewingGroup),
    enabled: viewingGroup !== null,
    staleTime: 5 * 60 * 1000,
  });

  if (myLoading) return <div>Загрузка расписания...</div>;
  if (myError) return <div style={{ color: 'red' }}>Ошибка: {myError.message}</div>;

  const mySchedule = myData?.schedule || {};
  const myGroupName = myData?.groupName || 'Группа';

  /* Активные данные для отображения */
  const activeSchedule = viewingGroup ? (otherSchedule ?? {}) : mySchedule;
  const activeGroupName = viewingGroup ?? myGroupName;
  const isViewingOther = viewingGroup !== null;

  const handleSelectGroup = (groupName) => {
    /* Если выбрали свою группу — сбрасываем режим просмотра */
    if (groupName === myGroupName) {
      setViewingGroup(null);
    } else {
      setViewingGroup(groupName);
    }
  };

  return (
    <>
      <div className="sched-page">

        {/* Хлебные крошки — только при просмотре чужой группы */}
        {isViewingOther && (
          <Breadcrumbs items={[
            { label: 'Расписание', onClick: () => setViewingGroup(null) },
            { label: 'Расписание группы' },
          ]} />
        )}

        {otherLoading && viewingGroup ? (
          <div className="sched-loading">Загрузка расписания группы {viewingGroup}...</div>
        ) : (
          <ScheduleView
            schedule={activeSchedule}
            groupName={activeGroupName}
            onGroupClick={() => setGroupModalOpen(true)}
            onCalendarClick={() => setCalendarOpen(true)}
          />
        )}

      </div>

      {calendarOpen && (
        <CalendarModal
          onClose={() => setCalendarOpen(false)}
          schedule={activeSchedule}
        />
      )}
      {groupModalOpen && (
        <GroupSelectorModal
          onClose={() => setGroupModalOpen(false)}
          onSelectGroup={handleSelectGroup}
          onSelectTeacher={(t) => console.log('Преподаватель:', t)}
        />
      )}
    </>
  );
}
