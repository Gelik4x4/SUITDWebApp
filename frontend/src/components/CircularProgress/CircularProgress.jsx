import s from './CircularProgress.module.css';


function CircularProgress({ progress }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <svg className={s.artdTotopRing} width="48" height="48" viewBox="0 0 48 48">
      {/* track */}
      <circle cx="24" cy="24" r={r} fill="none"
        stroke="rgba(91,110,245,0.18)" strokeWidth="3" />
      {/* progress arc */}
      <circle cx="24" cy="24" r={r} fill="none"
        stroke="var(--accent)" strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 24 24)"
        style={{ transition: 'stroke-dashoffset 0.2s ease' }}
      />
    </svg>
  );
}

export default CircularProgress;
