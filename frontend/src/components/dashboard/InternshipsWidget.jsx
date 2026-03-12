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
      <div className="intern-card__art">
        {color === 'pink' ? (
          <>
            <div className="blob blob--pink blob--lg" style={{ bottom: 8, left: 20 }} />
            <div className="blob blob--pink blob--sm" style={{ bottom: 8, left: 56 }} />
          </>
        ) : (
          <>
            <div className="blob blob--yellow blob--lg" style={{ bottom: 8, left: 20 }} />
            <div className="blob blob--yellow blob--sm" style={{ bottom: 8, left: 56 }} />
          </>
        )}
      </div>
    </div>
  );
}

export default function InternshipsWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Стажировки</span>
        <button className="icon-btn"><IconArrow /></button>
      </div>
      <div className="two-col-grid">
        <InternCard color="pink" />
        <InternCard color="yellow" />
      </div>
    </div>
  );
}
