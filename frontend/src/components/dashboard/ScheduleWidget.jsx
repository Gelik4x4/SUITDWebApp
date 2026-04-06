import { useQuery } from '@tanstack/react-query';
import './ScheduleWidget.css';
import { IconArrow } from '../icons/Icons';
import { supabase } from '@supabaseClient'


function ScheduleItem({ 
  time, 
  class_type: classType, 
  subject, 
  teacher, 
  room 
}) {
  return (
    <div className="schedule-item">
      <div className="schedule-item__accent" />
      <div className="schedule-item__body">
        <div className="schedule-item__row">
          <div>
            <div className="schedule-item__time">{time}</div>
            <div className="schedule-item__subject">{subject}</div>
            <a href="#" className="schedule-item__teacher">{teacher}</a>
          </div>
          <div className="schedule-item__right">
            <span className="badge">{classType}</span>
            <span className="schedule-item__room">{room}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const fetchMySchedule = async (capitalizedWeekday) => {
  // 1. Получаем ID текущего пользователя
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Достаем id_group из вашей таблицы профилей
  const { data: userData } = await supabase
    .from('users')
    .select('group_id')
    .eq('id', user.id)
    .single();

    if (!userData?.group_id) return [];

  // 3. Запрашиваем расписание по ID группы
  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('group_id', userData.group_id) // Фильтруем по ID
    .eq('day_of_week', capitalizedWeekday)
    .order('time', { ascending: true }); // Сразу сортируем по времени

  if (error) throw error;
  return data;
};


export default function ScheduleWidget() {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
  // день недели
  const weekday = now.toLocaleDateString('ru-RU', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();
  // const capitalizedWeekday = "Понедельник";
  // const capitalizedWeekday = "Вторник";
  // const capitalizedWeekday = "Среда";
  // const capitalizedWeekday = "Четверг";

  const { data: scheduleData, isLoading, error } = useQuery({
    queryKey: ['schedule', capitalizedWeekday],
    queryFn: () => fetchMySchedule(capitalizedWeekday),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div>Загрузка расписания...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error.message}</div>;

  console.log(scheduleData)

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <span className="card__title">Расписание</span>
          <span className="card__subtitle"> · {capitalizedWeekday}, {dateFormatted}</span>
        </div>
        <button className="icon-btn"><img src="/src/components/icons/arrow-btn.svg"/></button>
      </div>
      <div className="schedule-list">
        {scheduleData.map((item, i) => (
          <ScheduleItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
