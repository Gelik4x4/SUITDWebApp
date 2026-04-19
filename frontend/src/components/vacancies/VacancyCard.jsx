import './VacancyCard.css';
import VacancyTag from './VacancyTag';
import Icon from '@icon/Icon';


export default function VacancyCard({ vacancy, onOpen }) {
  return (
    <div className="vac-card">
      <div className="vac-card__header">
        <div className="vac-card__company-row">
          <div>
            <div className="vac-card__title">{vacancy.title}</div>
            <div className="vac-card__company">{vacancy.company}</div>
          </div>
        </div>
        <button className="icon-btn vac-card__fav"><Icon name="Heart"/></button>
      </div>

      <p className="vac-card__desc">{vacancy.description}</p>

      <div className="vac-card__footer">
        <div className="vac-card__tags">
          {vacancy.tags.map((tag, i) => (
            <VacancyTag key={i} label={tag} color={vacancy.tagColors[i]} />
          ))}
        </div>
        <button className="btn btn--primary vac-card__btn" onClick={() => onOpen(vacancy)}>
          Подробнее
        </button>
      </div>
    </div>
  );
}
