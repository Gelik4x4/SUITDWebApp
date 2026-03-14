import React from 'react';
import './OfferCard.css';

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function OfferCard({ offer, onClick }) {
  return (
    <div className="offer-card-item" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      {/* Photo area */}
      <div className="offer-card-item__img">
        <img src={offer.image} alt={offer.title} className="offer-card-item__photo" />
        <button className="offer-card-item__fav icon-btn" onClick={e => e.stopPropagation()}>
          <IconHeart />
        </button>
      </div>

      {/* Text */}
      <div className="offer-card-item__body">
        <div className="offer-card-item__row">
          <span className="offer-card-item__title">{offer.title}</span>
          <span className="offer-card-item__percent">{offer.percent}</span>
        </div>
        <p className="offer-card-item__desc">{offer.description}</p>
      </div>
    </div>
  );
}
