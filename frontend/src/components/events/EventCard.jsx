import './EventCard.css';
import FavButton from '../buttons/FavButton';

export default function EventCard({ event, isFav, onToggleFav, onClick }) {
  return (
    <div className="ev-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      {/* Image */}
      <div className="ev-card__img">
        {event.image
          ? <img src={event.image} alt={event.title} className="ev-card__photo" />
          : <div className="ev-card__img-placeholder" />
        }
        {/* Date badge top-left */}
        {event.date && (
          <span className="ev-card__date-badge">{event.date.split(',')[0]}</span>
        )}
        {/* Fav button top-right */}
        <div className="ev-card__fav-wrap" onClick={e => { e.stopPropagation(); onToggleFav(); }}>
          <FavButton active={isFav} />
        </div>
      </div>

      {/* Title */}
      <div className="ev-card__body">
        <div className="ev-card__title">{event.title}</div>
      </div>
    </div>
  );
}
