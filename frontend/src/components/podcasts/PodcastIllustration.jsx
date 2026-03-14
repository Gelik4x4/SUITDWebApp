export default function PodcastIllustration({ wide = false }) {
  const w = wide ? 480 : 220;
  const h = wide ? 260 : 140;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* bg */}
      <rect width={w} height={h} rx="12" fill="#c5bef5" />
    </svg>
  );
}
