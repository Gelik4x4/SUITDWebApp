import './InternshipsWidget.css';
import { IconArrow, IconHeart } from '../icons/Icons';

function InternCard({ color }) {
  return (
    <div className={`intern-card intern-card--${color}`}>
      <div className="intern-card__top">
        <div>
          <div className="intern-card__title">UI/UX Дизайнер</div>
          <div className="intern-card__company">Альфа-банк</div>
        </div>
        <button className="icon-btn icon-btn--sm"><IconHeart /></button>
      </div>

    </div>
  );
}

export default function InternshipsWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Стажировки</span>
        <button className="icon-btn"><img src="/src/components/icons/arrow-btn.svg"/></button>
      </div>
      <div className="two-col-grid">
        <InternCard color="pink" />
        <InternCard color="yellow" />
      </div>
    </div>
  );
}
