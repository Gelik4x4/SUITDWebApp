import React, { useEffect, useState } from 'react';
import favicon from '@/assets/img/favicon.svg';
import './SplashScreen.css';

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
        <img
          src={favicon}
          alt="SUITD"
          className="splash__logo"
          width="160"
          height="160"
        />

        <div className="splash__bar-wrap">
          <div className="splash__bar">
            <div
              className="splash__bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
