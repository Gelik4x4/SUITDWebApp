import './EventCard.css';
import EventIllustration from './EventIllustration';
import Icon from '@icon/Icon';


export default function EventCard({ event, onClick }) {
  return (
    <div className="ev-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      {/* Illustration */}
      <div className="ev-card__img">
        <EventIllustration />
        <button className="ev-card__fav icon-btn" onClick={e => e.stopPropagation()}>
          <Icon name="Heart"/>
        </button>
      </div>

      {/* Meta row */}
      <div className="ev-card__meta">
        <span className="ev-card__date">{event.date}</span>
        <span className="ev-card__loc">
          <Icon name="Location" size={16}/> {event.location}
        </span>
      </div>

      {/* Title */}
      <div className="ev-card__title">{event.title}</div>
    </div>
  );
}
