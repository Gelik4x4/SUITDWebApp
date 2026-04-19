import React from 'react';
import './ContestDetail.css';
import ContestIllustration from './ContestIllustration';
import Icon from '@icon/Icon';

export default function ContestDetail({ contest, onBack }) {
  return (
    <div className="con-detail">
      {/* Title row */}
      <div className="con-detail__titlerow">
        <button className="icon-btn con-detail__back" onClick={onBack}>
           <Icon name="ArrowLeft"/>
        </button>
        <h2 className="con-detail__title">{contest.title}</h2>
        <div className="con-detail__actions">
          <button className="icon-btn"> <Icon name="Share"/></button>
          <button className="icon-btn"> <Icon name="Heart"/></button>
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
             <Icon name="Clock"/>
            <span>{contest.date}</span>
          </div>
          <div className="con-meta-item">
             <Icon name="Tag"/>
            <span>{contest.location}</span>
          </div>
          <div className="con-meta-item">
             <Icon name="Location"/>
            <span>{contest.price}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
