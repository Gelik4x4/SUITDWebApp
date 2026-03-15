import { IconClock, IconHeart } from '@icons/Icons';
import './ArticleCard.module.css';


function ArticleCard({ article, onOpen }) {
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

export default ArticleCard;
