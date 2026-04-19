import './InternshipCard.css';
import InternshipTag from './InternshipTag';

const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function InternshipCard({ item, onOpen }) {
  return (
    <div className="int-card">
      <div className="int-card__header">
        {/*  avatar  */}
        <div className="int-card__avatar" style={{ background: item.avatarColor }} />
        <div>
          <div className="int-card__title">{item.title}</div>
          <div className="int-card__company">{item.company}</div>
        </div>
        <button className="icon-btn int-card__fav" onClick={e => e.stopPropagation()}>
          <IconHeart />
        </button>
      </div>

      <p className="int-card__desc">{item.description}</p>

      <div className="int-card__footer">
        <div className="int-card__tags">
          {item.tags.map((tag, i) => (
            <InternshipTag key={i} label={tag} color={item.tagColors[i]} />
          ))}
        </div>
        <button className="btn btn--primary int-card__btn" onClick={() => onOpen(item)}>
          Подробнее
        </button>
      </div>
    </div>
  );
}
