import './ContestCard.css';
import FavButton from '../buttons/FavButton';

export default function ContestCard({ contest, isFav, onToggleFav, onClick }) {
  return (
    <div className="con-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      <div className="con-card__img">
        {contest.image
          ? <img src={contest.image} alt={contest.title} className="con-card__photo" />
          : <div className="con-card__img-placeholder" />
        }
        <div
          className="con-card__fav-wrap"
          onClick={e => { e.stopPropagation(); onToggleFav(); }}
        >
          <FavButton active={isFav} />
        </div>
      </div>

      <div className="con-card__body">
        <div className="con-card__title">{contest.title}</div>
        {contest.deadline && (
          <div className="con-card__deadline">{contest.deadline}</div>
        )}
      </div>
    </div>
  );
}
