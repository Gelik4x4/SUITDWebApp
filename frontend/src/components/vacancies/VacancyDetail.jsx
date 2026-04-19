import './VacancyDetail.css';
import Icon from '@icon/Icon';



function Section({ title, items }) {
  return (
    <div className="vac-detail__section">
      <h3 className="vac-detail__section-title">{title}</h3>
      <ul className="vac-detail__list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function VacancyDetail({ vacancy, onBack }) {
  return (
    <div className="vac-detail">
      {/* Back + title row */}
      <div className="vac-detail__titlerow">
        <button className="vac-detail__back icon-btn" onClick={onBack}>
          <Icon name="ArrowLeft"/>
        </button>
        <h2 className="vac-detail__title">
          {vacancy.title} | {vacancy.company}
        </h2>
        <div className="vac-detail__title-actions">
          <button className="icon-btn"><Icon name="Share"/></button>
          <button className="icon-btn"><Icon name="Heart"/></button>
        </div>
      </div>

      {/* Top block: description + image + salary + CTA */}
      <div className="vac-detail__top">
        <div className="vac-detail__top-left">
          <p className="vac-detail__lead">{vacancy.fullDescription}</p>
          <div className="vac-detail__salary-row">
            <span className="vac-detail__salary">{vacancy.salary}</span>
            <button className="btn btn--primary vac-detail__join-btn">Присоединиться</button>
          </div>
        </div>
        <div className="vac-detail__image-placeholder">
        </div>
      </div>

      {/* Sections */}
      <div className="vac-detail__body">
        <Section title="Какие задачи вас ждут"  items={vacancy.tasks} />
        <Section title="Мы ждём, что вы"        items={vacancy.requirements} />
        <Section title="Для работы потребуются" items={vacancy.conditions} />
      </div>
    </div>
  );
}
