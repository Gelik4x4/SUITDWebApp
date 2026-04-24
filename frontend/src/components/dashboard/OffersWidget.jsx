import './OffersWidget.css';
import Icon from '@icon/Icon';
import FavButton from './FavButton';

// Импортируем изображения для карточек
import offer1Img from '/src/assets/img/offers/offer-1.png';
import offer2Img from '/src/assets/img/offers/offer-2.png';

function OfferCard({ img, discount, tagColor = 'orange', name }) {
  return (
    <div className="offer-card">
      {/* Фоновое изображение всегда присутствует */}
      <img src={img} alt={name} className="offer-card__bg-img" />
      <div className="offer-card__overlay" />

      {/* Верхняя строка: тег скидки + кнопка избранного */}
      <div className="offer-card__top-row">
        {discount && (
          <span className={`badge badge--${tagColor}`}>{discount}</span>
        )}
        <FavButton />
      </div>

      {/* Название */}
      <div className="offer-card__footer">
        <div className="offer-card__name">{name}</div>
      </div>
    </div>
  );
}

// Данные с реальными изображениями
const offers = [
  {
    img: offer1Img,
    discount: 'Скидка 10%',
    tagColor: 'purple',
    name: 'Кафе «Пышечка»',
  },
  {
    img: offer2Img,
    discount: 'Скидка 50%',
    tagColor: 'blue',
    name: 'Эрмитаж',
  },
];

export default function OffersWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Спецпредложения</span>
        <button className="icon-btn"><Icon name="ArrowUp" /></button>
      </div>
      <div className="offers-grid">
        {offers.map((o, i) => <OfferCard key={i} {...o} />)}
      </div>
    </div>
  );
}
