import './PodcastCard.css';

export default function PodcastCard({ show, onClick }) {
  return (
    <div
      className="pod-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="pod-card__img">
        {show.cover
          ? <img src={show.cover} alt={show.title} className="pod-card__photo" />
          : null
        }
      </div>
      <div className="pod-card__body">
        <div className="pod-card__title">{show.title}</div>
      </div>
    </div>
  );
}
