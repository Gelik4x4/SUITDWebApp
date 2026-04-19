import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './SchedulePage.css';
import GroupSelector from '../components/schedule/GroupSelector';
import DayStrip from '../components/schedule/DayStrip';
import LessonCard from '../components/schedule/LessonCard';
import BreakRow from '../components/schedule/BreakRow';
import CalendarModal from '../components/schedule/CalendarModal';
import GroupSelectorModal from '../components/schedule/GroupSelectorModal';
import Icon from '@icon/Icon';

import { supabase } from '@supabaseClient';

// Функция для генерации массива дней недели (Пн-Вс)
function getWeekDays(weekOffset = 0) {
  const now = new Date();
  const currentDay = now.getDay();
  const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return {
      num: day.getDate(),
      fullDate: day,
      isToday: day.toDateString() === new Date().toDateString()
    };
  });
}

const getCurrentDay = () => {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
};

const fetchFullSchedule = async () => {
  const dayToKey = {
    'понедельник': 0,
    'вторник': 1,
    'среда': 2,
    'четверг': 3,
    'пятница': 4,
    'суббота': 5,
    'воскресенье': 6
  };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Пользователь не авторизован");

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

  const initialSchedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  console.log(data);
  const schedule = data.reduce((acc, item) => {
    const dayName = item.day_of_week.toLowerCase().trim();
    const dayIndex = dayToKey[dayName];
    if (dayIndex !== undefined) {
      console.log(item.week_type);
      if (item.week_type.includes('числ')) {
        acc[dayIndex].push({
          type: 'lesson',
          time: item.time,
          subject: item.subject,
          teacher: item.teacher,
          room: item.room,
          class_type: item.class_type,
          tagColor: item.class_type === 'Лек' ? 'purple' : 'blue'
        });
        if (item.time.includes('13:05')) {
          acc[dayIndex].push({ type: 'break', time: '13:05 – 13:45', label: 'Обед' });
        }
      }
    }
    return acc;
  }, initialSchedule);

  return { schedule, groupName: userData.groups?.name };
};





// const fetchFullSchedule = async () => {
//   const dayToKey = {
//     'понедельник': 0, 'вторник': 1, 'среда': 2, 
//     'четверг': 3, 'пятница': 4, 'суббота': 5, 'воскресенье': 6
//   };

//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) throw new Error("Пользователь не авторизован");

//   const { data: userData } = await supabase
//     .from('users')
//     .select('group_id, groups(name)')
//     .eq('id', user.id)
//     .single();

//   if (!userData?.group_id) return { schedule: { numerator: {}, denominator: {} }, groupName: 'Нет группы' };

//   const { data, error } = await supabase
//     .from('schedule')
//     .select('*')
//     .eq('group_id', userData.group_id)
//     .order('time', { ascending: true });

//   if (error) throw error;

//   // Создаем две структуры: для числителя и знаменателя
//   const createEmptyWeek = () => ({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
  
//   const schedule = {
//     numerator: createEmptyWeek(),   // Числитель (нечетная)
//     denominator: createEmptyWeek()  // Знаменатель (четная)
//   };

//   data.forEach((item) => {
//     const dayName = item.day_of_week.toLowerCase().trim();
//     const dayIndex = dayToKey[dayName];
    
//     if (dayIndex === undefined) return;

//     const lesson = {
//       type: 'lesson',
//       time: item.time,
//       subject: item.subject,
//       teacher: item.teacher,
//       room: item.room,
//       class_type: item.class_type,
//       tagColor: item.class_type === 'Лек' ? 'purple' : 'blue'
//     };

//     const weekType = item.week_type.toLowerCase();

//     // Логика распределения:
//     // 1. Если "числитель" — добавляем в numerator
//     // 2. Если "знаменатель" — добавляем в denominator
//     // 3. Если "любая" или пусто — добавляем в оба
//     if (weekType.includes('числ')) {
//       schedule.numerator[dayIndex].push(lesson);
//     } else if (weekType.includes('знам')) {
//       schedule.denominator[dayIndex].push(lesson);
//     } else {
//       // Предмет каждую неделю
//       schedule.numerator[dayIndex].push(lesson);
//       schedule.denominator[dayIndex].push({...lesson});
//     }

//     // Добавляем обед (если нужно)
//     if (item.time.includes('13:05')) {
//       const lunch = { type: 'break', time: '13:05 – 13:45', label: 'Обед' };
//       if (weekType.includes('числ')) schedule.numerator[dayIndex].push(lunch);
//       else if (weekType.includes('знам')) schedule.denominator[dayIndex].push(lunch);
//       else {
//         schedule.numerator[dayIndex].push(lunch);
//         schedule.denominator[dayIndex].push(lunch);
//       }
//     }
//   });

//   return { schedule, groupName: userData.groups?.name };
// };

//  // 1. Сначала заполняем все занятия (как в предыдущем ответе)
//   data.forEach((item) => { /* ... код распределения занятий ... */ });

//   // 2. Функция для вставки обеда
//   const injectLunch = (dayArray) => {
//     // Ищем индекс занятия, которое заканчивается в 13:05 (или содержит это время)
//     const beforeIndex = dayArray.findIndex(item => item.time.includes('13:05'));
    
//     // Проверяем, есть ли что-то ПОСЛЕ этого занятия
//     if (beforeIndex !== -1 && dayArray[beforeIndex + 1]) {
//       const lunch = { type: 'break', time: '13:05 – 13:45', label: 'Обед' };
//       // Вставляем обед сразу после найденного занятия
//       dayArray.splice(beforeIndex + 1, 0, lunch);
//     }
//   };

//   // 3. Проходим по всем дням в обеих неделях
//   for (let i = 0; i <= 6; i++) {
//     injectLunch(schedule.numerator[i]);
//     injectLunch(schedule.denominator[i]);
//   }

//   return { schedule, groupName: userData.groups?.name };









export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [weekOffset, setWeekOffset] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false); // состояние для модалки группы

  const { data, isLoading, error } = useQuery({
    queryKey: ['fullSchedule'],
    queryFn: fetchFullSchedule,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div>Загрузка расписания...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error.message}</div>;

  const schedule = data?.schedule || {};
  const groupName = data?.groupName || "Группа";
  const days = getWeekDays(weekOffset);
  const items = schedule[activeDay] ?? [];

  const handlePrevWeek = () => setWeekOffset(prev => prev - 1);
  const handleNextWeek = () => setWeekOffset(prev => prev + 1);
  const handleToday = () => {
    setWeekOffset(0);
    setActiveDay(getCurrentDay());
  };

  // Заглушки для выбора группы/преподавателя (логика пока не требуется)
  const handleSelectGroup = (group) => {
    console.log('Выбрана группа:', group);
    // здесь позже можно добавить обновление расписания
  };

  const handleSelectTeacher = (teacher) => {
    console.log('Выбран преподаватель:', teacher);
    // здесь позже можно добавить логику
  };

  return (
    <>
      <div className="sched-page">
        <div className="sched-controls">
          {/* Обёртка для открытия модального окна по клику на GroupSelector */}
          <div onClick={() => setGroupModalOpen(true)} style={{ cursor: 'pointer' }}>
            <GroupSelector group={groupName} />
          </div>
          <div className="sched-controls__right">
            <div className="sched-nav-group">
              <button className="sched-icon-btn" onClick={() => setCalendarOpen(true)}>
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

        <DayStrip
          activeDay={activeDay}
          onDayChange={setActiveDay}
          days={days}
        />

        <div className="sched-list">
          {items.length === 0 ? (
            <div className="sched-empty">Занятий нет</div>
          ) : (
            items.map((item, i) =>
              item.type === 'break'
                ? <BreakRow key={i} time={item.time} label={item.label} />
                : <LessonCard key={i} {...item} num={i + 1} />
            )
          )}
        </div>
      </div>

      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
      {groupModalOpen && (
        <GroupSelectorModal
          onClose={() => setGroupModalOpen(false)}
          onSelectGroup={handleSelectGroup}
          onSelectTeacher={handleSelectTeacher}
        />
      )}
    </>
  );
}