import React from 'react';
import './ProfileField.css';

export default function ProfileField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  readOnly = false,
}) {
  return (
    <div className="profile-field">
      <label className="profile-field__label">{label}</label>
      <input
        className={`profile-field__input${readOnly ? ' profile-field__input--readonly' : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={readOnly ? undefined : e => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}
