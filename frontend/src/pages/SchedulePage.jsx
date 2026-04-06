import  { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './SchedulePage.css';
import GroupSelector  from '../components/schedule/GroupSelector';
import ViewToggle     from '../components/schedule/ViewToggle';
import DayStrip       from '../components/schedule/DayStrip';
import LessonCard     from '../components/schedule/LessonCard';
import BreakRow       from '../components/schedule/BreakRow';
import CalendarModal  from '../components/schedule/CalendarModal';

import { supabase } from '@supabaseClient';

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

// Функция для генерации массива дней недели (Пн-Вс)
function getWeekDays(weekOffset = 0) {
  const now = new Date();
  
  // Определяем текущий день недели (0 - Вс, 1 - Пн ...)
  const currentDay = now.getDay();
  
  // Находим разницу, чтобы откатиться к понедельнику текущей недели
  // (В JS: Пн=1...Сб=6, Вс=0. Делаем так, чтобы Пн стал 0)
  const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0); // Обнуляем время для точности

  // Создаем массив из 7 дней
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    
    return {
      num: day.getDate(),           // Число (напр. 15)
      fullDate: day,                // Объект даты целиком
      isToday: day.toDateString() === new Date().toDateString() // Флаг "сегодня"
    };
  });
}

// Получения текущего дня (0-6)
const getCurrentDay = () => {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Превращаем Sun=0 в 6, Mon=1 в 0
};

// // Получаем четную или нечетную неделю
// const getWeekType = (weekOffset = 0) => {
//   const now = new Date();
//   // Учитываем смещение недель, если пользователь листает календарь
//   const targetDate = new Date(now.setDate(now.getDate() + (weekOffset * 7)));
  
//   const dayOfMonth = targetDate.getDate();
//   // Вычисляем номер недели в месяце (1, 2, 3, 4...)
//   const weekOfMonth = Math.ceil(dayOfMonth / 7);
  
//   // Нечетная (1, 3, 5) — числ, четная (2, 4) — знам
//   return weekOfMonth % 2 !== 0 ? 'числ' : 'знам';
// };

const fetchFullSchedule = async () => {
  // Словарь для перевода строк из БД в индексы объекта
  const dayToKey = {
    'понедельник': 0,
    'вторник':     1,
    'среда':       2,
    'четверг':     3,
    'пятница':     4,
    'суббота':     5,
    'воскресенье': 6
  };

  // 1. Получаем ID текущего пользователя
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Пользователь не авторизован");

  // 2. Узнаем id_group пользователя
  const { data: userData } = await supabase
    .from('users')
    .select('group_id, groups(name)') // Берем id и имя группы для селектора
    .eq('id', user.id)
    .single();
  
  if (!userData?.group_id) return { schedule: {}, groupName: 'Нет группы' };

  // 3. Получаем всё расписание для этой группы
  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('group_id', userData.group_id)
    .order('time', { ascending: true });        // Сортируем по времени пары

  if (error) throw error;
  console.log(data);
  const initialSchedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

  // const currentType = getWeekType(weekOffset);  // числитель или знаменатель
  
  const schedule = data.reduce((acc, item) => {
    // const dbType = item.week_type?.toLowerCase().trim();
    // console.log(dbType);
    // Пропускаем, если типы не совпадают
    // (но оставляем, если в базе "числ/знам" или поле пустое)
    // if (dbType === 'числ' && currentType !== 'числ') return acc;
    // if (dbType === 'знам' && currentType !== 'знам') return acc;
    const dayName = item.day_of_week.toLowerCase().trim();
    const dayIndex = dayToKey[dayName];

    if (dayIndex !== undefined) {
      acc[dayIndex].push({
        type: 'lesson',
        time: item.time,
        subject: item.subject,
        teacher: item.teacher,
        room: item.room,
        class_type: item.class_type,
        tagColor: item.class_type === 'Лек' ? 'purple' : 'blue'
      });

      // Пример логики обеда
      if (item.time.includes('13:05')) {
        acc[dayIndex].push({ type: 'break', time: '13:05 – 13:45', label: 'Обед' });
      }
    }
    return acc;
  }, initialSchedule);

  return { schedule, groupName: userData.groups?.name };
};


export default function SchedulePage() {
  // Инициализируем активный день текущим днем недели
  const [activeDay,    setActiveDay]    = useState(getCurrentDay());
  const [viewMode,     setViewMode]     = useState('day');
  const [weekOffset,   setWeekOffset]   = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // 1. Получаем данные через React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['fullSchedule'],
    queryFn: fetchFullSchedule,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div>Загрузка профиля...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error.message}</div>;
  console.log(data)
  const schedule = data?.schedule || {};
  const groupName = data?.groupName || "Группа";
  const days = getWeekDays(weekOffset);
  const items = schedule[activeDay] ?? []; 

  return (
    <>
      <div className="sched-page">
        {/* ── Controls ── */}
        <div className="sched-controls">
          <GroupSelector group={groupName} />
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
                : <LessonCard key={i} {...item} num={i + 1} />
            )
          )}
        </div>
      </div>

      {/* ── Calendar modal ── */}
      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
    </>
  );
}
