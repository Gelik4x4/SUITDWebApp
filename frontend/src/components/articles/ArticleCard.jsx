import './ArticleCard.css';

function ArticleCard({ article, onOpen }) {
  // Форматируем строку дедлайна для отображения
  const deadlineLabel = article.deadline
    ? (article.deadline.toLowerCase().includes('завершен')
        ? `Прием заявок: завершен`
        : `Прием заявок до ${article.deadline}`)
    : '';

  return (
    <article className="art-card" onClick={() => onOpen(article)}>
      <div className="art-card__body">
        <h3 className="art-card__title">{article.title}</h3>

        {article.excerpt && (
          <p className="art-card__excerpt">{article.excerpt}</p>
        )}

        {deadlineLabel && (
          <p className="art-card__deadline">{deadlineLabel}</p>
        )}
      </div>
    </article>
  );
}

export default ArticleCard;
