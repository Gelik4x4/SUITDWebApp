import './ScheduleWidget.css';
import { IconArrow } from '../icons/Icons';

const scheduleData = [
  { time: '10:05 – 11:30', subject: 'Прикладной дизайн', teacher: 'Сошникова И.А.', room: 'В 484' },
  { time: '10:05 – 11:30', subject: 'Прикладной дизайн', teacher: 'Сошникова И.А.', room: 'В 484' },
  { time: '10:05 – 11:30', subject: 'Прикладной дизайн', teacher: 'Сошникова И.А.', room: 'В 484' },
];

function ScheduleItem({ time, subject, teacher, room }) {
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
            <span className="badge">Лек</span>
            <span className="schedule-item__room">{room}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <div>
          <span className="card__title">Расписание</span>
          <span className="card__subtitle"> · Четверг, 5 декабря</span>
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
