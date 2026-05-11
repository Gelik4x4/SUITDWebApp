import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

/* ── Логотип SUITD ── */
const SuitdLogo = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="160" rx="36" fill="#3b52e0" />
    <rect x="28" y="28" width="55" height="55" rx="14" fill="white" opacity="0.95" />
    <rect x="92" y="28" width="40" height="40" rx="11" fill="white" opacity="0.45" />
    <rect x="28" y="92" width="40" height="40" rx="11" fill="white" opacity="0.45" />
    <rect x="77" y="77" width="55" height="55" rx="14" fill="white" opacity="0.95" />
  </svg>
);

export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 800;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 200);
      }
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="splash">
      <div className="splash__content">
        <div className="splash__wordmark">
          <span className="splash__suitd">ЦАТ</span>
          <span className="splash__students">students</span>
        </div>
        <div className="splash__logo">
          <SuitdLogo />
        </div>
        <div className="splash__bar-wrap">
          <div className="splash__bar">
            <div className="splash__bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
