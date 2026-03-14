import './ArticleCard.css';

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function ArticleCard({ article, onOpen }) {
  return (
    <article className="art-card" onClick={() => onOpen(article)}>
      <div className="art-card__body">
        <div className="art-card__top">
          <h3 className="art-card__title">{article.title}</h3>
          <button className="icon-btn art-card__fav" onClick={e => { e.stopPropagation(); }}>
            <IconHeart />
          </button>
        </div>
        <p className="art-card__excerpt">{article.excerpt}</p>
        <div className="art-card__footer">
          <span className="art-card__readtime">
            <IconClock /> Время прочтения: {article.readTime}
          </span>
          <button
            className="btn btn--primary art-card__btn"
            onClick={e => { e.stopPropagation(); onOpen(article); }}
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  );
}
