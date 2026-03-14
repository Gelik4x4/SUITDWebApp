export default function EventIllustration({ wide = false }) {
  const vb = wide ? '0 0 780 280' : '0 0 220 140';
  const w   = wide ? 780 : 220;
  const h   = wide ? 280 : 140;

  return (
    <svg viewBox={vb} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* background */}
      <rect width={w} height={h} rx="10" fill="#b3c8f5" />

    </svg>
  );
}
