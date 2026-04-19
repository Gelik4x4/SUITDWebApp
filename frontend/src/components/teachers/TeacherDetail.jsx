import React from 'react';
import './TeacherDetail.css';

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

/* Default avatar placeholder */
const AvatarPlaceholder = () => (
  <div className="td-avatar-placeholder">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  </div>
);

export default function TeacherDetail({ teacher, onBack }) {
  return (
    <div className="td">
      {/* Title row */}
      <div className="td__titlerow">
        <button className="icon-btn td__back" onClick={onBack}><IconBack /></button>
        <h2 className="td__name">{teacher.name}</h2>
        <button className="icon-btn"><IconShare /></button>
      </div>

      {/* Body */}
      <div className="td__body">
        {/* Photo */}
        <div className="td__photo-col">
          {teacher.photo
            ? <img src={teacher.photo} alt={teacher.name} className="td__photo" />
            : <AvatarPlaceholder />
          }
        </div>

        {/* Info */}
        <div className="td__info">
          {/* Position */}
          <p className="td__position">{teacher.position}</p>

          {/* Contacts */}
          <div className="td__block">
            <div className="td__block-title">Контактная информация</div>
            <div className="td__contacts">
              <div className="td__contact-row">
                <span className="td__contact-label">E-mail:</span>
                <a href={`mailto:${teacher.email}`} className="td__link">{teacher.email}</a>
              </div>
              <div className="td__contact-row">
                <span className="td__contact-label">Телефон / факс:</span>
                <span>{teacher.phone}</span>
              </div>
              <div className="td__contact-row">
                <span className="td__contact-label">Адрес:</span>
                <span>{teacher.address}</span>
              </div>
            </div>
          </div>

          {/* Reception */}
          <div className="td__block">
            <div className="td__block-title">Часы приёма:</div>
            <div className="td__text">
              {teacher.reception.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="td__block">
            <div className="td__block-title">Образование</div>
            <div className="td__text">
              {teacher.education.map((item, i) => (
                <p key={i} className="td__edu-item">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
