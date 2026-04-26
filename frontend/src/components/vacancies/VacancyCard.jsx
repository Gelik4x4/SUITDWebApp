import './VacancyCard.css';
import FavButton from '../buttons/FavButton';

export default function VacancyCard({ vacancy, isFav, onToggleFav, onOpen }) {
  return (
    <div className="vac-card" onClick={onOpen} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}>

      {/* Header: лого + название + избранное */}
      <div className="vac-card__header">
        <div className="vac-card__company-row">
          {vacancy.companyLogo
            ? <img src={vacancy.companyLogo} alt={vacancy.company} className="vac-card__logo" />
            : <div className="vac-card__logo-placeholder">{vacancy.company[0]}</div>
          }
          <div>
            <div className="vac-card__title">{vacancy.title}</div>
            <div className="vac-card__company">{vacancy.company}</div>
          </div>
        </div>
        <div onClick={e => { e.stopPropagation(); onToggleFav(); }}>
          <FavButton active={isFav} />
        </div>
      </div>

      {/* Описание */}
      {vacancy.description && (
        <p className="vac-card__desc">{vacancy.description}</p>
      )}

      {/* Футер: теги + зарплата */}
      <div className="vac-card__footer">
        <div className="vac-card__tags">
          {vacancy.tags.map((tag, i) => (
            <span key={i} className="vac-card__tag">{tag}</span>
          ))}
        </div>
        <span className="vac-card__salary">{vacancy.salary}</span>
      </div>
    </div>
  );
}
