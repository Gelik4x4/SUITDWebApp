import React from 'react';
import './BarcodeStrip.css';

/*  SVG-штрихкод */
export default function BarcodeStrip({ value = '2222222222222' }) {
  const bars = [];
  let x = 0;
  const total = 220;
  const h = 52;

  const seed = value.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = 60;

  for (let i = 0; i < count; i++) {
    const w = i % 7 === 0
      ? ((seed * (i + 3) * 17) % 3) + 4 
      : i % 3 === 0
      ? ((seed * (i + 3) * 17) % 2) + 2 
      : ((seed * (i + 3) * 17) % 3) + 0.8; 
    const gap = ((seed * (i + 7) * 11) % 3) + 1;
    if (i % 2 === 0) {
      bars.push(<rect key={i} x={x} y={0} width={w} height={h} fill="var(--barcode-color)" />);
    }
    x += w + gap;
    if (x > total) break;
  }

  return (
    <div className="barcode-strip">
      <svg viewBox={`0 0 ${total} ${h}`} width={total} height={h} xmlns="http://www.w3.org/2000/svg">
        {bars}
      </svg>
    </div>
  );
}
