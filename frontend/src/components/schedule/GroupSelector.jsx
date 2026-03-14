import React from 'react';
import './GroupSelector.css';

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function GroupSelector({ group, onClick }) {
  return (
    <button className="group-selector" onClick={onClick}>
      Группа {group} <IconChevronDown />
    </button>
  );
}
