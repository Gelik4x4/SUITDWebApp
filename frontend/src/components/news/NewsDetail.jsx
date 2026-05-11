import { useEffect } from 'react';
import './NewsDetail.css';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import MobilePageHeader from '../MobilePageHeader/MobilePageHeader';

export default function NewsDetail({ item, onBack }) {
  /* Скрываем таббар на мобиле при просмотре новости */
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  return (
    <div className="news-detail">
      <MobilePageHeader title="Новости" />
      <div className="news-detail__breadcrumbs">
      <Breadcrumbs items={[
        { label: 'Сервисы', onClick: () => window.history.go(-2) },
        { label: 'Новости', onClick: onBack },
        { label: 'Информация о новости' },
      ]} />
      </div>
      <div className="news-detail__header">
        <h2 className="news-detail__title">{item.title}</h2>
        <span className="news-detail__date">{item.date}</span>
      </div>

      <div className="news-detail__article">
        <div className="news-detail__text">
          {item.fullText.map((para, i) => (
            <p key={i} className="news-detail__para">{para}</p>
          ))}
        </div>
        {item.image && (
          <div className="news-detail__photo-wrap">
            <img src={item.image} alt={item.title} className="news-detail__photo" />
          </div>
        )}
      </div>
    </div>
  );
}
