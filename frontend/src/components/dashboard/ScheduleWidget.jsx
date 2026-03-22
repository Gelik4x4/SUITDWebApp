import { useEffect, useState } from 'react'
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

export default function ScheduleWidget() {
  const group = "1-МГ-2";
  // const group = "1-МГ-46";
  // день недели
  // const day_of_week = "Понедельник";
  const day_of_week = "Вторник";
  // const day_of_week = "Среда";
  //const day_of_week = "Четверг";

  const [scheduleData, setScheduleData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const { data, error } = await supabase
          .from('schedule')
          .select('*')
          .eq('Группа', group)
          .eq('День недели', day_of_week);
        if (error)
          throw error;
        setScheduleData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchScheduleData();
  }, []);

  if (loading) return <div>Проверка подключения...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  console.log(scheduleData)

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <span className="card__title">Расписание</span>
          <span className="card__subtitle"> · {day_of_week}, 5 декабря</span>
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
