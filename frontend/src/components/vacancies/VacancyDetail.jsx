import React from 'react';
import './VacancyDetail.css';
import VacancyTag from './VacancyTag';

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconImage = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

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
          <IconBack />
        </button>
        <h2 className="vac-detail__title">
          {vacancy.title} | {vacancy.company}
        </h2>
        <div className="vac-detail__title-actions">
          <button className="icon-btn"><IconShare /></button>
          <button className="icon-btn"><IconHeart /></button>
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
          <IconImage />
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
