import './VacanciesWidget.css';
import { IconArrow, IconHeart } from '../icons/Icons';

function JobCard({ size = 'sm' }) {
  return (
    <div className={`job-card job-card--${size}`}>
      <div className="job-card__top">
        <div>
          <div className="job-card__title">UI/UX Дизайнер</div>
          <div className="job-card__company">Альфа-банк</div>
        </div>
        <button className="icon-btn icon-btn--sm"><IconHeart /></button>
      </div>
      <div className={`job-card__art job-card__art--${size}`}>
        {size === 'sm' ? (
          <>
            <div className="blob blob--purple blob--lg" />
            <div className="blob blob--blue blob--sm" />
          </>
        ) : (
          <>
            <div className="blob blob--orange blob--lg" style={{ bottom: 12, right: 40 }} />
            <div className="blob blob--orange blob--sm" style={{ bottom: 8,  right: 8  }} />
            <div className="blob blob--blue   blob--md" style={{ bottom: 24, right: 80 }} />
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
        <button className="icon-btn"><IconArrow /></button>
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
