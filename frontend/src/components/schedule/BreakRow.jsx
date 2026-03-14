import './BreakRow.css';

export default function BreakRow({ time, label }) {
  return (
    <div className="break-row">
      <div className="break-row__accent" />
      <span className="break-row__label">{label} {time}</span>
    </div>
  );
}
