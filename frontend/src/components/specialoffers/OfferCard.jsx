import React from 'react';
import './OfferCard.css';
import Icon from '@icon/Icon';
import FavButton from '../buttons/FavButton';

/* Цвета фона карточек на мобиле — по направлению */
const DIRECTION_COLORS = {
  'Учёба':              '#213FF9',
  'Музеи':             '#E8A598',
  'Кафе и рестораны':  '#F5C9B3',
  'Отдых и развлечения': '#4ECDC4',
  'Другое':            '#A89BFF',
};
const DEFAULT_COLOR = '#213FF9';

export default function OfferCard({ offer, onClick, isFav, onToggleFav }) {
  const mobBg = DIRECTION_COLORS[offer.direction] ?? DEFAULT_COLOR;

  return (
    <div
      className="offer-card-item"
      style={{ '--mob-card-bg': mobBg }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Desktop photo area */}
      <div className="offer-card-item__img">
        <img src={offer.image} alt={offer.title} className="offer-card-item__photo" />

        {/* Badge — desktop (inside img) */}
        <span className="offer-card-item__badge--img">{offer.percent}</span>

        {/* Direction tag */}
        {offer.direction && (
          <span className="offer-card-item__tag">{offer.direction}</span>
        )}

        {/* Fav — desktop (inside img) */}

        <div className={`offer-card-item__fav--img icon-btn${isFav ? ' offer-card-item__fav--active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleFav?.(offer.id); }}
          aria-label="В избранное"
        >
          <FavButton active={isFav} />
        </div>
      </div>

      {/* Mobile background image (right side) */}
      <div className="offer-card-item__mob-bg" aria-hidden="true">
        <img src={offer.image} alt="" />
      </div>

      {/* Text body */}
      <div className="offer-card-item__body">
        {/* Badge — mobile (inside body) */}
        <span className="offer-card-item__badge--body">{offer.percent}</span>
        <p className="offer-card-item__title">{offer.title}</p>
        <p className="offer-card-item__period">{offer.period}</p>
      </div>

      <div className={`offer-card-item__fav--mob icon-btn${isFav ? ' offer-card-item__fav--active' : ''}`}
        onClick={e => { e.stopPropagation(); onToggleFav?.(offer.id); }}
        aria-label="В избранное"
      >
        <FavButton active={isFav} />
      </div>

    </div>
  );
}
