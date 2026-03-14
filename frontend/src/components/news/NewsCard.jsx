import './NewsCard.css';

export default function NewsCard({ item, onOpen }) {
  return (
    <article className="news-card" onClick={() => onOpen(item)}>
      <div className="news-card__body">
        <h3 className="news-card__title">{item.title}</h3>
        <p className="news-card__excerpt">{item.excerpt}</p>
        <div className="news-card__footer">
          <span className="news-card__date">{item.date}</span>
          <button
            className="btn btn--primary news-card__btn"
            onClick={e => { e.stopPropagation(); onOpen(item); }}
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  );
}
