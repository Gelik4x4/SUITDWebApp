import React from 'react';
import './StudentCardView.css';
import BarcodeStrip from './BarcodeStrip';

export default function StudentCardView({ data }) {
  return (
    <div className="sc-card">
      {/* Top section */}
      <div className="sc-card__top">
        <div className="sc-card__left">
          <div className="sc-card__qualification">{data.qualification}</div>
          <div className="sc-card__name">{data.name}</div>
          <div className="sc-card__role">{data.role}</div>

          <div className="sc-card__fields">
            <div className="sc-card__field">
              <div className="sc-card__field-label">Группа</div>
              <div className="sc-card__field-value">{data.group}</div>
            </div>
            <div className="sc-card__field">
              <div className="sc-card__field-label">Номер студенческого</div>
              <div className="sc-card__field-value">{data.studentId}</div>
            </div>
            <div className="sc-card__field">
              <div className="sc-card__field-label">Дата рождения</div>
              <div className="sc-card__field-value">{data.birthDate}</div>
            </div>
            <div className="sc-card__field">
              <div className="sc-card__field-label">Кафедра</div>
              <div className="sc-card__field-value">{data.department}</div>
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="sc-card__photo-wrap">
          {data.photo
            ? <img src={data.photo} alt={data.name} className="sc-card__photo" />
            : (
              <div className="sc-card__photo-placeholder">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
            )
          }
        </div>
      </div>

      {/* Divider */}
      <div className="sc-card__divider" />

      {/* Barcode */}
      <div className="sc-card__barcode">
        <BarcodeStrip value={data.studentId} />
      </div>
    </div>
  );
}
