import React from 'react';
import './ServiceCard.css';

export default function ServiceCard({ label, color, Abstract, size = 'md', onClick }) {
  return (
    <button
      className={`srv-card srv-card--${color} srv-card--${size}`}
      onClick={onClick}
    >
      {/* Abstract background illustration */}
      {Abstract && (
        <span className="srv-card__art" aria-hidden="true">
          <Abstract />
        </span>
      )}
      <span className="srv-card__label">{label}</span>
    </button>
  );
}
