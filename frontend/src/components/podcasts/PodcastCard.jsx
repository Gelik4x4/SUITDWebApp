import './PodcastCard.css';
import PodcastIllustration from './PodcastIllustration';
import Icon from '@icon/Icon';


export default function PodcastCard({ podcast, onClick }) {
  return (
    <div className="pod-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="pod-card__img">
        <PodcastIllustration />
        <button className="pod-card__fav icon-btn" onClick={e => e.stopPropagation()}>
          <Icon name="Heart"/>
        </button>
      </div>
      <div className="pod-card__body">
        <div className="pod-card__title">{podcast.title}</div>
        <div className="pod-card__date">{podcast.date}</div>
      </div>
    </div>
  );
}
