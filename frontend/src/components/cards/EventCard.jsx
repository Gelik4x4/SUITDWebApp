import { IconHeart, IconPin } from '../icons/Icons';


function EventCard() {
  return (
    <div className="event-card">
      <button className="icon-btn icon-btn--sm event-card__fav">
        <IconHeart />
      </button>
      <div className="event-card__art">
        <div className="blob blob--blue-light blob--xl" style={{ top: -10, left: -10 }} />
      </div>
      <div className="event-card__footer">
        <div className="event-card__meta">
          <span>Чт, 6 июня 20:00</span>
          <span className="event-card__location">
            <IconPin /> Точка Кипения
          </span>
        </div>
        <div className="event-card__title">
          Молодежный экономический форум «День будущего»
        </div>
      </div>
    </div>
  );
}

export default EventCard