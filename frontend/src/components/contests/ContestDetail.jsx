import React from 'react';
import './ContestDetail.css';
import ContestIllustration from './ContestIllustration';

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
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export default function ContestDetail({ contest, onBack }) {
  return (
    <div className="con-detail">
      {/* Title row */}
      <div className="con-detail__titlerow">
        <button className="icon-btn con-detail__back" onClick={onBack}>
          <IconBack />
        </button>
        <h2 className="con-detail__title">{contest.title}</h2>
        <div className="con-detail__actions">
          <button className="icon-btn"><IconShare /></button>
          <button className="icon-btn"><IconHeart /></button>
        </div>
      </div>

      {/* Content */}
      <div className="con-detail__body">
        <div className="con-detail__left">
          {/* Hero illustration */}
          <div className="con-detail__hero">
            <ContestIllustration />
          </div>

          {/* Full text */}
          <div className="con-detail__text">
            {contest.fullText.split('\n\n').map((para, i) => (
              <p key={i} className="con-detail__para">{para}</p>
            ))}
          </div>

          {/* Register CTA */}
          <button className="con-detail__register btn btn--primary">
            Зарегистрироваться
          </button>
        </div>

        {/* Meta sidebar */}
        <aside className="con-detail__meta">
          <div className="con-meta-item">
            <IconClock />
            <span>{contest.date}</span>
          </div>
          <div className="con-meta-item">
            <IconPin />
            <span>{contest.location}</span>
          </div>
          <div className="con-meta-item">
            <IconTag />
            <span>{contest.price}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
