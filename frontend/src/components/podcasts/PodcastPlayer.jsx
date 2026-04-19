import React, { useState, useRef, useEffect } from 'react';
import './PodcastPlayer.css';
import Icon from '@icon/Icon';


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
          <Icon name="Shuffle"/>
        </button>

        <button className="icon-btn pod-player__ctrl" onClick={() => skip(-15)}>
          <Icon name="Back15Sec"/>
        </button>

        <button
          className="pod-player__play-btn"
          onClick={() => setPlaying(p => !p)}
          aria-label={playing ? 'Пауза' : 'Воспроизвести'}
        >
          {playing ? <Icon name="Pause"/> : <Icon name="Play"/>}
        </button>

        <button className="icon-btn pod-player__ctrl" onClick={() => skip(15)}>
          <Icon name="Forward15Sec"/>
        </button>

        <button
          className={`icon-btn pod-player__ctrl${repeat ? ' pod-player__ctrl--active' : ''}`}
          onClick={() => setRepeat(r => !r)}
        >
          <Icon name="Repeat"/>
        </button>
      </div>
    </div>
  );
}
