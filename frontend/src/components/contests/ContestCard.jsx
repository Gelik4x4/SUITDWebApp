import './ContestCard.css';
import ContestIllustration from './ContestIllustration';

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function ContestCard({ contest, onClick }) {
  return (
    <div className="con-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="con-card__img">
        <ContestIllustration />
        <button
          className="con-card__fav icon-btn"
          onClick={e => { e.stopPropagation(); }}
        >
          <IconHeart />
        </button>
      </div>
      <div className="con-card__body">
        <div className="con-card__title">{contest.title}</div>
        <div className="con-card__desc">{contest.description}</div>
        <div className="con-card__deadline">{contest.deadline}</div>
      </div>
    </div>
  );
}
