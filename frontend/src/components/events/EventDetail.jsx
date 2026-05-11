import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import './EventDetail.css';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import FavButton   from '../buttons/FavButton';
import Icon from '@icon/Icon';

export default function EventDetail({ event, onBack, isFav, onToggleFav, fetchDetail }) {
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  const { data: detail, isLoading } = useQuery({
    queryKey: ['event-detail', event.id],
    queryFn: () => fetchDetail(event.id),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(fetchDetail && event.id),
  });

  const image       = detail?.image       || event.image;
  const date        = detail?.date        || event.date;
  const location    = detail?.location    || event.location;
  const address     = detail?.address     ?? '';
  const description = detail?.description || event.description || '';
  const regDeadline = detail?.regDeadline ?? '';

  return (
    <div className="evd">
      {/* Мобильный hero: фото + оверлей с кнопками */}
      <div className="evd__mobile-hero">
        {image
          ? <img src={image} alt={event.title} className="evd__mobile-hero__img" />
          : <div className="evd__mobile-hero__placeholder" />
        }
        <div className="evd__mobile-hero__overlay">
          <button className="evd__mobile-hero__back" onClick={onBack} aria-label="Назад">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="evd__mobile-hero__actions">
            <button className="evd__mobile-hero__btn" onClick={onToggleFav}>
              <Icon name={isFav ? 'HeartFilled' : 'Heart'} size={20} />
            </button>
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="evd__mobile-hero__btn">
              <Icon name="Share" size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="evd__breadcrumbs"><Breadcrumbs items={[
        { label: 'Сервисы',     onClick: () => window.history.go(-2) },
        { label: 'Мероприятия', onClick: onBack },
        { label: 'Информация о мероприятии' },
      ]} /></div>

      <div className="evd__body">

        {/* Left: обёрнуто в карточку */}
        <div className="evd__main">
          <div className="evd__titlerow">
            <h2 className="evd__title">{event.title}</h2>
            <div className="evd__actions">
              <FavButton active={isFav} onClick={onToggleFav} />
              <a href={event.link} target="_blank" rel="noopener noreferrer"
                className="icon-btn" title="Открыть на сайте">
                <Icon name="Share" />
              </a>
            </div>
          </div>

          {image && (
            <div className="evd__banner">
              <img src={image} alt={event.title} className="evd__banner-img" />
            </div>
          )}

          {isLoading ? (
            <div className="evd__loading">Загрузка информации...</div>
          ) : description ? (
            <>
              <div className="evd__section-title">О мероприятии</div>
              <p className="evd__desc">{description}</p>
            </>
          ) : null}
        </div>

        {/* Right: meta sidebar */}
        <aside className="evd__meta">
          {location && (
            <div className="evd-meta-item">
              <Icon name="Location" size={24} />
              <div>
                <div>{location}</div>
                {address && <div className="evd-meta-item__sub">{address}</div>}
              </div>
            </div>
          )}
          {date && (
            <div className="evd-meta-item">
              <Icon name="Clock" size={24} />
              <span>{date}</span>
            </div>
          )}
          {regDeadline && (
            <div className="evd-meta-item">
              <Icon name="Info" size={24} />
              <span>{regDeadline}</span>
            </div>
          )}

          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="evd__register btn btn--primary"
          >
            Записаться
          </a>
        </aside>

      </div>

      {/* Мобильная фиксированная кнопка «Записаться» */}
      <div className="evd__mobile-register">
        <a href={event.link} target="_blank" rel="noopener noreferrer"
          className="evd__register btn btn--primary">
          Записаться
        </a>
      </div>
    </div>
  );
}
