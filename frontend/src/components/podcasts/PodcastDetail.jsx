import './PodcastDetail.css';
import PodcastIllustration from './PodcastIllustration';
import PodcastPlayer       from './PodcastPlayer';
import Icon from '@icon/Icon';


export default function PodcastDetail({ podcast, onBack }) {
  return (
    <div className="pod-detail">
      {/* Title row */}
      <div className="pod-detail__titlerow">
        <button className="icon-btn pod-detail__back" onClick={onBack}><Icon name="ArrowLeft"/></button>
        <h2 className="pod-detail__title">{podcast.fullTitle}</h2>
        <div className="pod-detail__actions">
          <button className="icon-btn"><Icon name="Share"/></button>
          <button className="icon-btn"><Icon name="Heart"/></button>
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
