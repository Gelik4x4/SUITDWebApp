import React from 'react';
import './StudentCardView.css';
import BarcodeStrip from './BarcodeStrip';

export default function StudentCardView({ data }) {
  return (
    <div className="sc-card">
      <div className="sc-card__qualification">{data.qualification ?? 'Студент'}</div>
      <div className="sc-card__name">{data.name}</div>

      <div className="sc-card__fields">
        <div className="sc-card__field">
          <div className="sc-card__field-label">Группа</div>
          <div className="sc-card__field-value">{data.group || '—'}</div>
        </div>
        <div className="sc-card__field">
          <div className="sc-card__field-label">Номер студенческого</div>
          <div className="sc-card__field-value">{data.studentId || '—'}</div>
        </div>
        <div className="sc-card__field">
          <div className="sc-card__field-label">Дата рождения</div>
          <div className="sc-card__field-value">{data.birthDate || '—'}</div>
        </div>
        <div className="sc-card__field">
          <div className="sc-card__field-label">Факультет</div>
          <div className="sc-card__field-value">{data.faculty || '—'}</div>
        </div>
      </div>

      <div className="sc-card__barcode">
        <BarcodeStrip value={data.studentId ?? '0000000000000'} />
      </div>
    </div>
  );
}
