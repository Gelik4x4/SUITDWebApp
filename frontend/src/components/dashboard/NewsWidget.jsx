import './NewsWidget.css';
import Icon from '@icon/Icon';

const newsImages = [
  '/src/assets/img/news/news1.png',
  '/src/assets/img/news/news2.png',
  '/src/assets/img/news/news3.png',
];

export default function NewsWidget() {
  return (
    <div className="card news-card">
      <div className="card__header">
        <span className="card__title">Новости</span>
        <button className="icon-btn"><Icon name="ArrowUp" /></button>
      </div>
      <div className="news-list">
        {newsImages.map((src, i) => (
          <div key={i} className="news-item">
            <img src={src} alt="news" className="news-item__img" />
          </div>
        ))}
      </div>
    </div>
  );
}
