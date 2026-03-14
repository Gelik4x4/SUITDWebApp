import React from 'react';
import './VacancyCard.css';
import VacancyTag from './VacancyTag';

const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconCompany = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="var(--bg)" />
    <path d="M8 24V12l8-4 8 4v12H8z" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" />
    <rect x="13" y="16" width="6" height="8" rx="1" fill="var(--text-secondary)" opacity="0.4" />
  </svg>
);

export default function VacancyCard({ vacancy, onOpen }) {
  return (
    <div className="vac-card">
      <div className="vac-card__header">
        <div className="vac-card__company-row">
          <IconCompany />
          <div>
            <div className="vac-card__title">{vacancy.title}</div>
            <div className="vac-card__company">{vacancy.company}</div>
          </div>
        </div>
        <button className="icon-btn vac-card__fav"><IconHeart /></button>
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
