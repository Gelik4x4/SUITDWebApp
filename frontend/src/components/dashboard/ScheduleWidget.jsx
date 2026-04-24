import { useQuery } from '@tanstack/react-query';
import './ScheduleWidget.css';
import Icon from '@icon/Icon';
import { supabase } from '@supabaseClient';

/* Определяем цвет полоски по типу занятия */
const accentColor = (classType) => {
  if (!classType) return 'purple';
  const t = classType.toLowerCase();
  if (t === 'пр' || t === 'практика') return 'orange';
  return 'purple';
};

function ScheduleItem({ time, class_type: classType, subject, teacher, room }) {
  /* time приходит как "08:30-09:55" или "08:30 – 09:55" */
  const [start, end] = time?.split(/[-–]/).map(s => s.trim()) ?? [time, ''];
  const color = accentColor(classType);

  return (
    <div className="schedule-item">
      <div className="schedule-item__time-col">
        <span className="schedule-item__time-start">{start}</span>
        {end && <span className="schedule-item__time-end">{end}</span>}
      </div>
      <div className="schedule-item__divider" />
      <div className="schedule-item__body">
        <div className="schedule-item__subject">{subject}</div>
        <div className="schedule-item__location">
          {[room, teacher].filter(Boolean).join('  ·  ')}
        </div>
      </div>
      <div className="schedule-item__right">
        {classType && (
          <span className={`badge badge--${color === 'orange' ? 'orange' : 'purple'}`}>
            {classType}
          </span>
        )}
      </div>
    </div>
  );
}

const fetchMySchedule = async (capitalizedWeekday) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: userData } = await supabase
    .from('users')
    .select('group_id')
    .eq('id', user.id)
    .single();

  if (!userData?.group_id) return [];

  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('group_id', userData.group_id)
    .eq('day_of_week', capitalizedWeekday)
    .order('time', { ascending: true });

  if (error) throw error;
  return data;
};

export default function ScheduleWidget() {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const weekday = now.toLocaleDateString('ru-RU', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();
  // const capitalizedWeekday = "Понедельник";
  const { data: scheduleData, isLoading, error } = useQuery({
    queryKey: ['schedule', capitalizedWeekday],
    queryFn: () => fetchMySchedule(capitalizedWeekday),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  if (isLoading) return <div className="card schedule-card--empty"><div>Загрузка...</div></div>;
  if (error) return <div className="card schedule-card--empty" style={{ color: 'red' }}>Ошибка: {error.message}</div>;

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <span className="card__title">Расписание</span>
          <span className="card__subtitle"> · {capitalizedWeekday}, {dateFormatted}</span>
        </div>
        <button className="icon-btn"><Icon name="ArrowUp" /></button>
      </div>
      {scheduleData.length === 0 ? (
        <div className="schedule-empty">
          <span className="schedule-empty__text">Занятий нет</span>
        </div>
      ) : (
        <div className="schedule-list">
          {scheduleData.map((item, i) => (
            <ScheduleItem key={i} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
