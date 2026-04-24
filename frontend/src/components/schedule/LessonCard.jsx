import './LessonCard.css';

/* Цвет полоски и бейджа по типу занятия */
const accentColor = (classType) => {
  if (!classType) return 'purple';
  const t = classType.toLowerCase();
  if (t === 'пр' || t === 'практика') return 'orange';
  if (t === 'лаб' || t === 'лабораторная') return 'blue';
  return 'purple';
};

export default function LessonCard({ time, subject, teacher, room, class_type }) {
  const [start, end] = time?.split(/[-–]/).map(s => s.trim()) ?? [time, ''];
  const color = accentColor(class_type);

  return (
    <div className="lesson-item">
      <div className="lesson-item__time-col">
        <span className="lesson-item__time-start">{start}</span>
        {end && <span className="lesson-item__time-end">{end}</span>}
      </div>
      <div className="lesson-item__divider" />
      <div className="lesson-item__body">
        <div className="lesson-item__subject">{subject}</div>
        <div className="lesson-item__location">
          {[room, teacher].filter(Boolean).join('  ·  ')}
        </div>
      </div>
      <div className="lesson-item__right">
        {class_type && (
          <span className={`badge badge--${color}`}>{class_type}</span>
        )}
      </div>
    </div>
  );
}
