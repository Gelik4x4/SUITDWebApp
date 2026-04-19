import './ContestCard.css';
import ContestIllustration from './ContestIllustration';
import Icon from '@icon/Icon';


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
          <Icon name="Heart"/>
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
