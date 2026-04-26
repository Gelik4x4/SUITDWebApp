import './TeacherListItem.css';

export default function TeacherListItem({ teacher, isSelected, onClick }) {
  return (
    <button
      className={`teacher-item${isSelected ? ' teacher-item--selected' : ''}`}
      onClick={onClick}
    >
      {teacher.name}
    </button>
  );
}
