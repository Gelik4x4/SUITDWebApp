import './VacanciesWidget.css';
import Icon from '@icon/Icon';

function JobCard({ size = 'sm' }) {
  return (
    <div className={`job-card job-card--${size}`}>
      <div className="job-card__top">
        <div>
          <div className="job-card__title">UI/UX Дизайнер</div>
          <div className="job-card__company">Альфа-банк</div>
        </div>
        <button className="icon-btn icon-btn--sm"><Icon name="Heart"/></button>
      </div>
      <div className={`job-card__art job-card__art--${size}`}>
        {size === 'sm' ? (
          <>
            <div className="blob blob--blue blob--lg" style={{ bottom: 8, left: 160 }} />
            <div className="blob blob--blue blob--sm" style={{ bottom: 12, left: 120 }}/>
          </>
        ) : (
          <>
            <div className="blob blob--orange blob--lg" style={{ bottom: 12, right: 20 }} />
            <div className="blob blob--orange blob--sm" style={{ bottom: 8,  right: 110  }} />
            <div className="blob blob--orange   blob--md" style={{ bottom: 65, right: 70 }} />
          </>
        )}
      </div>
    </div>
  );
}

export default function VacanciesWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Популярные вакансии</span>
        <button className="icon-btn"><Icon name="ArrowUp"/></button>
      </div>
      <div className="vacancies-grid">
        <div className="vacancies-grid__left">
          <JobCard size="sm" />
          <JobCard size="sm" />
        </div>
        <JobCard size="lg" />
      </div>
    </div>
  );
}
