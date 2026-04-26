import './ClubCard.css';

export default function ClubCard({ club, onClick }) {
  return (
    <div className="club-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      <div className="club-card__img">
        {club.image
          ? <img src={club.image} alt={club.name} className="club-card__photo" />
          : <div className="club-card__img-placeholder" />
        }
      </div>

      <div className="club-card__body">
        <div className="club-card__name">{club.name}</div>
      </div>
    </div>
  );
}
