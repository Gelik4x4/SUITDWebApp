import React, { useState, useRef, useEffect } from 'react';
import './PodcastPlayer.css';

const IconPlay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconPause = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const IconShuffle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);
const IconRewind = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="11 19 2 12 11 5 11 19" />
    <line x1="22" y1="5" x2="22" y2="19" />
  </svg>
);
const IconForward = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="13 19 22 12 13 5 13 19" />
    <line x1="2" y1="5" x2="2" y2="19" />
  </svg>
);
const IconRepeat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }
function fmtTime(s) { return `${pad(s / 60)}:${pad(s % 60)}`; }

export default function PodcastPlayer({ duration = '15:00' }) {
  const [playing,  setPlaying]  = useState(false);
  const [current,  setCurrent]  = useState(0); // seconds
  const [shuffle,  setShuffle]  = useState(false);
  const [repeat,   setRepeat]   = useState(false);
  const timerRef = useRef(null);

  /* Parse duration string to seconds */
  const [mStr, sStr] = duration.split(':');
  const totalSec = parseInt(mStr, 10) * 60 + parseInt(sStr || '0', 10);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => {
          if (prev >= totalSec) {
            setPlaying(false);
            return repeat ? 0 : totalSec;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, totalSec, repeat]);

  const seek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setCurrent(Math.round(ratio * totalSec));
  };

  const skip = (delta) => setCurrent(prev => Math.min(Math.max(prev + delta, 0), totalSec));

  const progress = totalSec > 0 ? (current / totalSec) * 100 : 0;

  return (
    <div className="pod-player">
      {/* Progress bar */}
      <div className="pod-player__progress-wrap" onClick={seek}>
        <div className="pod-player__progress-track">
          <div className="pod-player__progress-fill" style={{ width: `${progress}%` }} />
          <div className="pod-player__progress-thumb" style={{ left: `${progress}%` }} />
        </div>
      </div>
      <div className="pod-player__times">
        <span>{fmtTime(current)}</span>
        <span>{duration}</span>
      </div>

      {/* Controls */}
      <div className="pod-player__controls">
        <button
          className={`icon-btn pod-player__ctrl${shuffle ? ' pod-player__ctrl--active' : ''}`}
          onClick={() => setShuffle(s => !s)}
        >
          <IconShuffle />
        </button>

        <button className="icon-btn pod-player__ctrl" onClick={() => skip(-15)}>
          <IconRewind />
        </button>

        <button
          className="pod-player__play-btn"
          onClick={() => setPlaying(p => !p)}
          aria-label={playing ? 'Пауза' : 'Воспроизвести'}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>

        <button className="icon-btn pod-player__ctrl" onClick={() => skip(15)}>
          <IconForward />
        </button>

        <button
          className={`icon-btn pod-player__ctrl${repeat ? ' pod-player__ctrl--active' : ''}`}
          onClick={() => setRepeat(r => !r)}
        >
          <IconRepeat />
        </button>
      </div>
    </div>
  );
}
