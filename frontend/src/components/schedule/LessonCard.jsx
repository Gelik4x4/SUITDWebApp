import './LessonCard.css';

const TAG_COLORS = {
  purple: { bg: '#ede9ff', text: '#6B5CE7' },
  blue:   { bg: '#e0eeff', text: '#3a7bd5' },
  green:  { bg: '#e0f5ee', text: '#27ae60' },
  orange: { bg: '#fff0e0', text: '#e07b00' },
};

export default function LessonCard({ num, time, subject, teacher, room, class_type, tagColor = 'purple' }) {
  const colors = TAG_COLORS[tagColor] ?? TAG_COLORS.purple;
  return (
    <div className="lesson">
      {/* Numbered time header */}
      <div className="lesson__timerow">
        <span className="lesson__num">{num}</span>
        <span className="lesson__time">{time}</span>
      </div>

      {/* Card */}
      <div className="lesson__card">
        <div className="lesson__body">
          <div className="lesson__subject">{subject}</div>
          <div className="lesson__teacher">{teacher}</div>
          <div className="lesson__room">{room}</div>
        </div>
        <span className="lesson__tag" style={{ background: colors.bg, color: colors.text }}>
          {class_type}
        </span>
      </div>
    </div>
  );
}
