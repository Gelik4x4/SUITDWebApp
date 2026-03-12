import './EventsWidget.css';
import EventCard from '../cards/EventCard.jsx';
import { IconArrow } from '../icons/Icons';



export default function EventsWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Мероприятия для вас</span>
        <button className="icon-btn"><IconArrow /></button>
      </div>
      <div className="two-col-grid">
        <EventCard />
        <EventCard />
      </div>
    </div>
  );
}
