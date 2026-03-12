import './NewsWidget.css';
import { IconArrow } from '../icons/Icons';

const newsImages = [
  'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=100&fit=crop',
];

export default function NewsWidget() {
  return (
    <div className="card news-card">
      <div className="card__header">
        <span className="card__title">Новости</span>
        <button className="icon-btn"><IconArrow /></button>
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
