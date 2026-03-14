import './PodcastCard.css';
import PodcastIllustration from './PodcastIllustration';

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function PodcastCard({ podcast, onClick }) {
  return (
    <div className="pod-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="pod-card__img">
        <PodcastIllustration />
        <button className="pod-card__fav icon-btn" onClick={e => e.stopPropagation()}>
          <IconHeart />
        </button>
      </div>
      <div className="pod-card__body">
        <div className="pod-card__title">{podcast.title}</div>
        <div className="pod-card__date">{podcast.date}</div>
      </div>
    </div>
  );
}
