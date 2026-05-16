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
import TeacherScheduleView from '../components/schedule/TeacherScheduleView';
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

/* ─── Week parity helpers ─────────────────────────────────────── */

/**
 * Возвращает номер недели по ISO 8601.
 * Неделя 1 года — та, в которую входит первый четверг января.
 */
const getISOWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Четверг текущей недели определяет год недели
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - yearStart.getTime()) / 86400000 -
        3 +
        ((yearStart.getDay() + 6) % 7)) /
        7
    )
  );
};

/**
 * По условию задачи: неделя 1 года — чётная.
 * Чётная неделя → "числитель" (числ), нечётная → "знаменатель" (знам).
 *
 * isEvenWeek(date) === true  ⟹ неделя чётная ⟹ показываем числитель
 * isEvenWeek(date) === false ⟹ неделя нечётная ⟹ показываем знаменатель
 */
const isEvenWeek = (date) => getISOWeekNumber(date) % 2 === 0;

/**
 * Определяет, подходит ли запись расписания под текущую неделю.
 * week_type может содержать: 'числ', 'знам', или быть пустым/null (каждую неделю).
 */
const matchesWeek = (weekType, date) => {
  if (!weekType) return true;
  const wt = weekType.toLowerCase().trim();
  if (!wt || wt === 'каждую' || wt === 'каждая') return true;

  const even = isEvenWeek(date);
  if (wt.includes('числ')) return even;   // числитель — чётная
  if (wt.includes('знам')) return !even;  // знаменатель — нечётная
  return true; // неизвестный тип — показываем всегда
};

/**
 * Лейбл текущей недели для UI
 */
const getWeekLabel = (date) => {
  const week = getISOWeekNumber(date);
  const parity = isEvenWeek(date) ? 'чётная (числитель)' : 'нечётная (знаменатель)';
  return `${week} неделя — ${parity}`;
};

/* ─── Data fetching ───────────────────────────────────────────── */

const DAY_KEY = {
  'понедельник': 0, 'вторник': 1, 'среда': 2,
  'четверг': 3, 'пятница': 4, 'суббота': 5, 'воскресенье': 6,
};

/**
 * Собираем расписание в формат:
 * { dayIndex: { even: [...], odd: [...] } }
 *
 * even — пары числителя (чётная неделя)
 * odd  — пары знаменателя (нечётная неделя)
 * Записи без указания недели попадают в оба массива.
 */
const buildScheduleMap = (data) => {
  const schedule = {};
  for (let i = 0; i <= 6; i++) {
    schedule[i] = { even: [], odd: [] };
  }

  data.forEach((item) => {
    const dayIndex = DAY_KEY[item.day_of_week.toLowerCase().trim()];
    if (dayIndex === undefined) return;

    const wt = (item.week_type || '').toLowerCase().trim();
    const lesson = {
      time: item.time,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
      class_type: item.class_type,
    };

    const isNumerator   = wt.includes('числ');
    const isDenominator = wt.includes('знам');
    const isEvery       = !isNumerator && !isDenominator;

    if (isNumerator || isEvery) schedule[dayIndex].even.push(lesson);
    if (isDenominator || isEvery) schedule[dayIndex].odd.push(lesson);
  });

  return schedule;
};

/* Получаем расписание для конкретной группы по её названию */
const fetchScheduleByGroupName = async (groupName) => {
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('id')
    .eq('name', groupName)
    .single();
  if (groupError) throw groupError;

  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('group_id', groupData.id)
    .order('time', { ascending: true });
  if (error) throw error;

  return buildScheduleMap(data);
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

  return { schedule: buildScheduleMap(data), groupName: userData.groups?.name };
};

/* ─── Get lessons for a specific date from the schedule map ───── */

/**
 * Возвращает уроки для конкретной даты, учитывая чётность недели.
 * scheduleMap: { dayIndex: { even: [], odd: [] } }
 */
const getLessonsForDate = (scheduleMap, date) => {
  const dayIndex = weekdayIndex(date);
  const dayData = scheduleMap[dayIndex];
  if (!dayData) return [];
  return isEvenWeek(date) ? (dayData.even ?? []) : (dayData.odd ?? []);
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

function DaySection({ date, scheduleMap, sectionRef, onTeacherClick }) {
  const lessons = getLessonsForDate(scheduleMap, date);

  return (
    <section
      className="sched-day-section"
      data-date={date.toISOString()}
      ref={sectionRef}
    >
      <h2 className="sched-day-title">
        {formatDayTitle(date)}
      </h2>
      {lessons.length === 0 ? (
        <div className="sched-empty">Нет событий</div>
      ) : (
        <div className="sched-list">
          {lessons.map((item, i) => (
            <LessonCard key={i} {...item} date={date} onTeacherClick={onTeacherClick} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Inner schedule view ─────────────────────────────────────── */

function ScheduleView({ scheduleMap, groupName, onGroupClick, onCalendarClick, onTeacherClick, scrollToDateRef }) {
  const dateList = useRef(buildDateList());
  const [activeDate, setActiveDate] = useState(today());
  const sectionRefs = useRef([]);
  const scrollRef = useRef(null);
  const scrollElRef = useRef(null);
  const isProgrammaticScroll = useRef(false);

  /* Скролл к произвольной дате — вызывается из CalendarModal через ref */
  const scrollToDate = useCallback((date) => {
    const todayDate = today();
    const target = date < todayDate ? todayDate : date;
    setActiveDate(target);
    const idx = dateList.current.findIndex(
      d => d.toDateString() === target.toDateString()
    );
    if (idx < 0) return;
    isProgrammaticScroll.current = true;
    scrollToSection(scrollElRef.current ?? scrollRef.current, sectionRefs.current[idx]);
    setTimeout(() => { isProgrammaticScroll.current = false; }, 900);
  }, []);

  useEffect(() => {
    if (scrollToDateRef) scrollToDateRef.current = scrollToDate;
  }, [scrollToDate, scrollToDateRef]);

  const stripDays = buildWeekStrip(activeDate);
  const activeDayIndex = weekdayIndex(activeDate);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    scrollElRef.current = isMobile
      ? scrollRef.current
      : scrollRef.current?.closest('.main') ?? scrollRef.current;
  }, []);

  useEffect(() => {
    const scrollRoot = scrollElRef.current ?? scrollRef.current;
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
      { root: scrollElRef.current ?? scrollRef.current, rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    sectionRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [scheduleMap]);

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
    scrollToSection(scrollElRef.current ?? scrollRef.current, target);
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
      scrollToSection(scrollElRef.current ?? scrollRef.current, sectionRefs.current[idx]);
      setTimeout(() => { isProgrammaticScroll.current = false; }, 900);
    }
  };

  return (
    <>
      <div className="sched-sticky-header">
        {/* Controls */}
        <div className="sched-controls">
          <div onClick={onGroupClick} style={{ cursor: 'pointer' }}>
            <GroupSelector group={groupName} />
          </div>
          <div className="sched-controls__right">
            <div className="sched-nav-group sched-nav-group--week">
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
            <div className="sched-nav-group sched-nav-group--calendar">
              <button className="sched-icon-btn" onClick={onCalendarClick}>
                <Icon name="Calendar" />
              </button>
            </div>
          </div>
        </div>

        {/* DayStrip */}
        <DayStrip
          activeDay={activeDayIndex}
          onDayChange={handleDayChange}
          days={stripDays}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      </div>

      {/* Scroll area */}
      <div className="sched-scroll" ref={scrollRef}>
        {dateList.current.map((date, i) => (
          <DaySection
            key={date.toISOString()}
            date={date}
            scheduleMap={scheduleMap}
            sectionRef={el => (sectionRefs.current[i] = el)}
            onTeacherClick={onTeacherClick}
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
  const [viewingGroup, setViewingGroup] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  /* Ref-колбэк: CalendarModal вызывает scrollToDateRef.current(date) */
  const scrollToDateRef = useRef(null);

  /* Своё расписание */
  const { data: myData, isLoading: myLoading, error: myError } = useQuery({
    queryKey: ['mySchedule'],
    queryFn: fetchMySchedule,
    staleTime: 5 * 60 * 1000,
  });

  /* Расписание выбранной группы */
  const { data: otherScheduleMap, isLoading: otherLoading } = useQuery({
    queryKey: ['scheduleByGroup', viewingGroup],
    queryFn: () => fetchScheduleByGroupName(viewingGroup),
    enabled: viewingGroup !== null,
    staleTime: 5 * 60 * 1000,
  });

  if (myLoading) return <div>Загрузка расписания...</div>;
  if (myError) return <div style={{ color: 'red' }}>Ошибка: {myError.message}</div>;

  const myScheduleMap = myData?.schedule || {};
  const myGroupName = myData?.groupName || 'Группа';

  const activeScheduleMap = viewingGroup ? (otherScheduleMap ?? {}) : myScheduleMap;
  const activeGroupName = viewingGroup ?? myGroupName;
  const isViewingOther = viewingGroup !== null;

  const handleSelectGroup = (groupName) => {
    setViewingTeacher(null);
    if (groupName === myGroupName) {
      setViewingGroup(null);
    } else {
      setViewingGroup(groupName);
    }
  };

  const handleCalendarSelectDate = (date) => {
    setCalendarOpen(false);
    /* Даём модалу закрыться, затем скроллим */
    setTimeout(() => scrollToDateRef.current?.(date), 50);
  };

  return (
    <>
      <div className="sched-page">

        {viewingTeacher ? (
          <>
            <Breadcrumbs items={[
              { label: 'Расписание', onClick: () => setViewingTeacher(null) },
              { label: 'Расписание преподавателя' },
            ]} />
            <TeacherScheduleView
              teacher={{ name: viewingTeacher }}
              onTeacherClick={() => setGroupModalOpen(true)}
            />
          </>
        ) : (
          <>
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
                scheduleMap={activeScheduleMap}
                groupName={activeGroupName}
                onGroupClick={() => setGroupModalOpen(true)}
                onCalendarClick={() => setCalendarOpen(true)}
                onTeacherClick={(t) => setViewingTeacher(t)}
                scrollToDateRef={scrollToDateRef}
              />
            )}
          </>
        )}

      </div>

      {calendarOpen && (
        <CalendarModal
          onClose={() => setCalendarOpen(false)}
          schedule={activeScheduleMap}
          getLessonsForDate={getLessonsForDate}
          onSelectDate={handleCalendarSelectDate}
        />
      )}
      {groupModalOpen && (
        <GroupSelectorModal
          onClose={() => setGroupModalOpen(false)}
          onSelectGroup={handleSelectGroup}
          onSelectTeacher={(t) => { setViewingTeacher(t); setViewingGroup(null); }}
        />
      )}
    </>
  );
}
