import './InternshipsWidget.css';
import Icon from '@icon/Icon';

function InternCard({ color }) {
  return (
    <div className={`intern-card intern-card--${color}`}>
      <div className="intern-card__top">
        <div>
          <div className="intern-card__title">UI/UX Дизайнер</div>
          <div className="intern-card__company">Альфа-банк</div>
        </div>
        <button className="icon-btn icon-btn--sm"><Icon name="Heart"/></button>
      </div>

    </div>
  );
}

export default function InternshipsWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Стажировки</span>
        <button className="icon-btn"><Icon name="ArrowUp"/></button>
      </div>
      <div className="two-col-grid">
        <InternCard color="pink" />
        <InternCard color="yellow" />
      </div>
    </div>
  );
}
