import './NewsWidget.css';
import { IconArrow } from '../icons/Icons';

const newsImages = [
  '/src/components/img/news/news1.png',
  '/src/components/img/news/news2.png',
  '/src/components/img/news/news3.png',
];

export default function NewsWidget() {
  return (
    <div className="card news-card">
      <div className="card__header">
        <span className="card__title">Новости</span>
        <button className="icon-btn"><img src="/src/components/icons/arrow-btn.svg"/></button>
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
