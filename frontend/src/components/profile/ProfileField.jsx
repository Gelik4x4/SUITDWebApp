import React from 'react';
import './ProfileField.css';

export default function ProfileField({ label, placeholder, value, onChange, type = 'text' }) {
  return (
    <div className="profile-field">
      <label className="profile-field__label">{label}</label>
      <input
        className="profile-field__input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
