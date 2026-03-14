import React from 'react';
import './TeacherListItem.css';

export default function TeacherListItem({ teacher, isSelected, onClick }) {
  return (
    <div
      className={`teacher-item${isSelected ? ' teacher-item--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {teacher.name}
    </div>
  );
}
