import './EventCard.css';
import EventIllustration from './EventIllustration';

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

export default function EventCard({ event, onClick }) {
  return (
    <div className="ev-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      {/* Illustration */}
      <div className="ev-card__img">
        <EventIllustration />
        <button className="ev-card__fav icon-btn" onClick={e => e.stopPropagation()}>
          <IconHeart />
        </button>
      </div>

      {/* Meta row */}
      <div className="ev-card__meta">
        <span className="ev-card__date">{event.date}</span>
        <span className="ev-card__loc">
          <IconPin /> {event.location}
        </span>
      </div>

      {/* Title */}
      <div className="ev-card__title">{event.title}</div>
    </div>
  );
}
