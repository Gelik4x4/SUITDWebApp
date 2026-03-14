import React from 'react';
import './OfferModal.css';

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconShare = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconHeart = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function OfferModal({ offer, onClose }) {
  return (
    /* Overlay */
    <div className="offer-modal-overlay" onClick={onClose}>
      <div className="offer-modal" onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div className="offer-modal__header">
          <span className="offer-modal__title">{offer.title}</span>
          <div className="offer-modal__header-actions">
            <button className="icon-btn"><IconShare /></button>
            <button className="icon-btn"><IconHeart /></button>
            <button className="icon-btn offer-modal__close" onClick={onClose}>
              <IconClose />
            </button>
          </div>
        </div>

        {/* Period */}
        <p className="offer-modal__period">{offer.period}</p>

        {/* Content: text + image */}
        <div className="offer-modal__body">
          <div className="offer-modal__text">
            {offer.fullText.split('\n').map((line, i) => (
              line === '' ? <br key={i} /> :
              line.startsWith('*') ? (
                <p key={i} className="offer-modal__note">{line}</p>
              ) : (
                <p key={i} className="offer-modal__para">{line}</p>
              )
            ))}
          </div>
          <div className="offer-modal__img-wrap">
            <img src={offer.image} alt={offer.title} className="offer-modal__img" />
          </div>
        </div>
      </div>
    </div>
  );
}
