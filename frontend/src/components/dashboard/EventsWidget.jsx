import './EventsWidget.css';
import EventCard from '../cards/EventCard.jsx';
import { IconArrow } from '../icons/Icons';



const events = [
  {
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop',
    date: 'Чт, 6 июня 20:00',
    location: 'Точка Кипения',
    title: 'Молодежный экономический форум «День будущего»',
  },
  {
    img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=300&fit=crop',
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
        <button className="icon-btn"><IconArrow /></button>
      </div>
      <div className="two-col-grid">
        {events.map((e, i) => <EventCard key={i} {...e} />)}
      </div>
    </div>
  );
}

