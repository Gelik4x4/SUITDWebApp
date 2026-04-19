import './EventsWidget.css';
import EventCard from '../cards/EventCard.jsx';
import Icon from '@icon/Icon';



const events = [
  {
    img: '/src/assets/img/events/events-1.png',
    date: 'Чт, 6 июня 20:00',
    location: 'Точка Кипения',
    title: 'Молодежный экономический форум «День будущего»',
  },
  {
    img: '/src/assets/img/events/events-1.png',
    date: 'Чт, 6 июня 20:00',
    location: 'Точка Кипения',
    title: 'Молодежный экономический форум «День будущего»',
  },
];



export default function EventsWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Мероприятия для вас</span>
        <button className="icon-btn"><Icon name="ArrowUp"/></button>
      </div>
      <div className="two-col-grid">
        {events.map((e, i) => <EventCard key={i} {...e} />)}
      </div>
    </div>
  );
}

