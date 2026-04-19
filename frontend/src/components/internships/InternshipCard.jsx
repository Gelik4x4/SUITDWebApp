import './InternshipCard.css';
import InternshipTag from './InternshipTag';
import Icon from '@icon/Icon';


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
          <Icon name="Heart"/>
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
