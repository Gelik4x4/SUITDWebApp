import './OfferModal.css';
import Icon from '@icon/Icon';


export default function OfferModal({ offer, onClose }) {
  return (
    /* Overlay */
    <div className="offer-modal-overlay" onClick={onClose}>
      <div className="offer-modal" onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div className="offer-modal__header">
          <span className="offer-modal__title">{offer.title}</span>
          <div className="offer-modal__header-actions">
            <button className="icon-btn"><Icon name="Share"/></button>
            <button className="icon-btn"><Icon name="Heart"/></button>
            <button className="icon-btn offer-modal__close" onClick={onClose}>
              <Icon name="Cross" size={32}/>
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
