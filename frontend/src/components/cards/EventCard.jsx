import Icon from '@icon/Icon';


function EventCard({ img, date, location, title }) {
  return (
    <div className="event-card">
      {/* Photo */}
      <div className="event-card__img-wrap">
        <img src={img} alt={title} className="event-card__photo" />
        <button className="event-card__fav">
          <Icon name="Heart" color="red" />
        </button>
      </div>

      {/* Text */}
      <div className="event-card__footer">
        <div className="event-card__meta">
          <span>{date}</span>
          <span className="event-card__location">
            <Icon name="Location" /> {location}
          </span>
        </div>
        <div className="event-card__title">{title}</div>
      </div>
    </div>
  );
}

export default EventCard;
