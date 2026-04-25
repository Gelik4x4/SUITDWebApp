import './EventsWidget.css';
import Icon from '@icon/Icon';
import FavButton from './FavButton';

/* 
  img      — путь к фоновому изображению (обязательный)
  date     — строка даты "09 апр 20:00"
  tagColor — цвет тега даты
  title    — название мероприятия
*/
function EventCard({ img, date, tagColor = 'purple', title }) {
  return (
    <div className="event-card event-card--has-img">
      <img src={img} alt={title} className="event-card__bg-img" />
      <div className="event-card__overlay" />

      {/* Верхняя строка: тег + кнопка избранного */}
      <div className="event-card__top-row">
        {date && (
          <span className={`badge badge--${tagColor}`}>{date}</span>
        )}
        <FavButton />
      </div>

      {/* Текст */}
      <div className="event-card__footer">
        <div className="event-card__title">{title}</div>
      </div>
    </div>
  );
}

/* Моковые данные — заменить на реальный API */
const events = [
  {
    img: '/src/assets/img/events/event-1.png',
    date: '09 апр 20:00',
    tagColor: 'purple',
    title: 'IX Международный конгресс «Дизайн. Материалы. Технология»',
  },
  {
    img: '/src/assets/img/events/event-2.png',
    date: '11 апр 18:00',
    tagColor: 'orange',
    title: 'Как создать и продвигать писательский бренд',
  },
  {
    img: '/src/assets/img/events/event-3.png',
    date: '17 апр 16:00',
    tagColor: 'blue',
    title: 'Студенческая весна 2026, финал',
  },
];

export default function EventsWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Мероприятия для вас</span>
        <button className="icon-btn"><Icon name="ArrowUp" /></button>
      </div>
      <div className="events-grid">
        {events.map((e, i) => <EventCard key={i} {...e} />)}
      </div>
    </div>
  );
}
