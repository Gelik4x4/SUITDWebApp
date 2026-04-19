import './PodcastDetail.css';
import PodcastIllustration from './PodcastIllustration';
import PodcastPlayer       from './PodcastPlayer';

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function PodcastDetail({ podcast, onBack }) {
  return (
    <div className="pod-detail">
      {/* Title row */}
      <div className="pod-detail__titlerow">
        <button className="icon-btn pod-detail__back" onClick={onBack}><IconBack /></button>
        <h2 className="pod-detail__title">{podcast.fullTitle}</h2>
        <div className="pod-detail__actions">
          <button className="icon-btn"><IconShare /></button>
          <button className="icon-btn"><IconHeart /></button>
        </div>
      </div>

      {/* Body */}
      <div className="pod-detail__body">
        {/* Left */}
        <div className="pod-detail__left">
          <div className="pod-detail__cover">
            <PodcastIllustration wide />
          </div>
          <p className="pod-detail__desc">{podcast.description}</p>
        </div>

        {/* Right */}
        <aside className="pod-detail__sidebar">
          <PodcastPlayer duration={podcast.duration} />

          <div className="pod-detail__episode">
            <div className="pod-detail__episode-date">{podcast.dateShort}</div>
            <div className="pod-detail__episode-title">{podcast.fullTitle}</div>
            <div className="pod-detail__episode-show">{podcast.show}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
