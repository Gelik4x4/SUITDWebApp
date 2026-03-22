import { useQuery } from '@tanstack/react-query';
import './ScheduleWidget.css';
import { IconArrow } from '../icons/Icons';
import { supabase } from '../../supabaseClient'


function ScheduleItem({ 
  "Время": time,
  "Вид занятий": lessonType, 
  "Дисциплина": subject, 
  "Преподаватель": teacher, 
  "Аудитория": room
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
            <span className="badge">{lessonType}</span>
            <span className="schedule-item__room">{room}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const fetchScheduleData = async (group, capitalizedWeekday) => {
  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('Группа', group)
    .eq('День недели', capitalizedWeekday);
  if (error) throw error;
  return data;
};


export default function ScheduleWidget() {
  const group = "1-МГ-2";
  // const group = "1-МГ-46";
  
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
  // день недели
  const weekday = now.toLocaleDateString('ru-RU', { weekday: 'long' });
  // const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();
  // const capitalizedWeekday = "Понедельник";
  const capitalizedWeekday = "Вторник";
  // const capitalizedWeekday = "Среда";
  // const capitalizedWeekday = "Четверг";

  const { data: scheduleData, isLoading, error } = useQuery({
    queryKey: ['schedule', group, capitalizedWeekday],
    queryFn: () => fetchScheduleData(group, capitalizedWeekday),
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
        <button className="icon-btn"><IconArrow /></button>
      </div>
      <div className="schedule-list">
        {scheduleData.map((item, i) => (
          <ScheduleItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
