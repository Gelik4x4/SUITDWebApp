import React from 'react';
import './EventDetail.css';
import EventIllustration from './EventIllustration';
import Icon from '@icon/Icon';


export default function EventDetail({ event, onBack }) {
  return (
    <div className="evd">
      {/* Title row */}
      <div className="evd__titlerow">
        <button className="icon-btn evd__back" onClick={onBack}><Icon name="ArrowLeft"/></button>
        <h2 className="evd__title">{event.title}</h2>
        <div className="evd__actions">
          <button className="icon-btn"><Icon name="Share"/></button>
          <button className="icon-btn"><Icon name="Heart"/></button>
        </div>
      </div>

      {/* Main content + meta sidebar */}
      <div className="evd__body">
        <div className="evd__main">
          {/* Wide banner illustration */}
          <div className="evd__banner">
            <EventIllustration wide />
          </div>

          {/* Description */}
          <p className="evd__desc">{event.description}</p>

          {/* Register CTA */}
          <button className="evd__register btn btn--primary">
            Зарегистрироваться
          </button>
        </div>

        {/* Meta sidebar */}
        <aside className="evd__meta">
          <div className="evd-meta-item">
            <Icon name="Clock"/>
            <span>{event.date}</span>
          </div>
          <div className="evd-meta-item">
            <Icon name="Tag"/>
            <span>{event.price}</span>
          </div>
          <div className="evd-meta-item">
            <Icon name="Location"/>
            <span>{event.location}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
