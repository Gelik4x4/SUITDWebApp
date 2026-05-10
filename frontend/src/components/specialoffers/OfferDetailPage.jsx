import { useNavigate } from 'react-router-dom';
import './OfferDetailPage.css';
import Icon from '@icon/Icon';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';

export default function OfferDetailPage({ offer, onBack, onToggleFav, isFav }) {
  const navigate = useNavigate();
  if (!offer) return null;

  const breadcrumbs = [
    { label: 'Сервисы', onClick: () => navigate('/services') },
    { label: 'Специальные предложения', onClick: onBack },
    { label: 'Информация о спецпредложении' },
  ];

  // Parse fullText into segments
  const lines = offer.fullText.split('\n');

  return (
    <div className="odp-page">
      {/* Desktop breadcrumbs */}
      <div className="odp-desktop-breadcrumbs">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Mobile hero image with overlaid navigation */}
      <div className="odp-mobile-hero">
        {offer.image && (
          <img src={offer.image} alt={offer.title} className="odp-mobile-hero__img" />
        )}
        <div className="odp-mobile-hero__nav">
          <button
            className="odp-mobile-hero__back"
            onClick={onBack}
            aria-label="Назад"
          >
            <Icon name="ArrowLeft" size={24} />
          </button>
          <div className="odp-mobile-hero__actions">
            <button
              className={`odp-mobile-hero__action${isFav ? ' odp-mobile-hero__action--fav-active' : ''}`}
              onClick={() => onToggleFav && onToggleFav(offer.id)}
              aria-label="В избранное"
            >
              <Icon name="Heart" size={20} />
            </button>
            <button className="odp-mobile-hero__action" aria-label="Поделиться">
              <Icon name="Share" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="odp-card">
        {/* Header */}
        <div className="odp-card__header">
          <h2 className="odp-card__title">{offer.title}</h2>
          {/* Desktop actions */}
          <div className="odp-card__actions">
            <button
              className={`icon-btn${isFav ? ' odp-fav--active' : ''}`}
              onClick={() => onToggleFav && onToggleFav(offer.id)}
              aria-label="В избранное"
            >
              <Icon name="Heart" size={22} />
            </button>
            <button className="icon-btn" aria-label="Поделиться">
              <Icon name="Share" size={22} />
            </button>
          </div>
        </div>

        {/* Period */}
        <p className="odp-card__period">{offer.period}</p>

        {/* Body text */}
        <div className="odp-card__body">
          {lines.map((line, i) => {
            if (line === '') return <br key={i} />;
            if (line.startsWith('*')) return <p key={i} className="odp-card__note">{line}</p>;
            if (line.startsWith('**') && line.endsWith('**')) return (
              <p key={i} className="odp-card__bold">{line.replace(/\*\*/g, '')}</p>
            );
            return <p key={i} className="odp-card__para">{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
