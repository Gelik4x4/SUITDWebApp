import React from 'react';
import './VacancyTag.css';

export default function VacancyTag({ label, color = 'gray' }) {
  return <span className={`vac-tag vac-tag--${color}`}>{label}</span>;
}
