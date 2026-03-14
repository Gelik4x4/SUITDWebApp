import './InternshipTag.css';

export default function InternshipTag({ label, color = 'gray' }) {
  return <span className={`int-tag int-tag--${color}`}>{label}</span>;
}
