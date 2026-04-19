import React from 'react';
import './OfferCard.css';
import Icon from '@icon/Icon';


export default function OfferCard({ offer, onClick }) {
  return (
    <div className="offer-card-item" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      {/* Photo area */}
      <div className="offer-card-item__img">
        <img src={offer.image} alt={offer.title} className="offer-card-item__photo" />
        <button className="offer-card-item__fav icon-btn" onClick={e => e.stopPropagation()}>
          <Icon name="Heart"/>
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
