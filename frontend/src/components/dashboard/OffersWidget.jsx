import { useNavigate } from 'react-router-dom';
import './OffersWidget.css';
import Icon from '@icon/Icon';
import FavButton from '../buttons/FavButton';
import { SPECIAL_OFFERS } from '@constants/specialOffersData';

function OfferCard({ offer, onClick, wide = false }) {
  return (
    <div
      className={`offer-card${wide ? ' offer-card--wide' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <img src={offer.image} alt={offer.title} className="offer-card__bg-img" />
      <div className="offer-card__overlay" />

      <div className="offer-card__top-row">
        {offer.percent && (
          <span className="badge badge--orange">{offer.percent}</span>
        )}
        <FavButton />
      </div>

      <div className="offer-card__footer">
        <div className="offer-card__name">{offer.title}</div>
        {offer.description && (
          <div className="offer-card__desc">{offer.description}</div>
        )}
      </div>
    </div>
  );
}

// index: если передан — рендерим одну карточку для мобильного слота
export default function OffersWidget({ index }) {
  const navigate = useNavigate();

  const handleOfferClick = (offer) => {
    navigate('/services/specialoffers', { state: { openItem: offer } });
  };

  if (index !== undefined) {
    const offer = SPECIAL_OFFERS[index];
    if (!offer) return null;
    return (
      <OfferCard
        offer={offer}
        wide
        onClick={() => handleOfferClick(offer)}
      />
    );
  }

  const latest = SPECIAL_OFFERS.slice(0, 2);

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Спецпредложения</span>
        <button className="icon-btn" onClick={() => navigate('/services/specialoffers')}>
          <Icon name="ArrowUp" />
        </button>
      </div>
      <div className="offers-grid">
        {latest.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onClick={() => handleOfferClick(offer)}
          />
        ))}
      </div>
    </div>
  );
}
