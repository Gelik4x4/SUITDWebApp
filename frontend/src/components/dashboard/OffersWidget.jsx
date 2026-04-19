import './OffersWidget.css';
import Icon from '@icon/Icon';

function OfferCard({ color }) {
  return (
    <div className={`offer-card offer-card--${color}`}>
      <div className="offer-card__percent">5%</div>
      <div className="offer-card__name">Кофемания</div>
      <div className="offer-card__desc">При заказе <br/>от 500₽</div>
    </div>
  );
}

export default function OffersWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Спецпредложения</span>
        <button className="icon-btn"><Icon name="ArrowUp"/></button>
      </div>
      <div className="offers-grid">
        <OfferCard color="gray" />
        <OfferCard color="blue" />
        <OfferCard color="peach" />
      </div>
    </div>
  );
}
