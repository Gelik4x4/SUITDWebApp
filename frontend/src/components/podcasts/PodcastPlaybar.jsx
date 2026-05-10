import { useState, useRef, useEffect, useCallback } from 'react';
import './PodcastPlaybar.css';
import Icon from '@icon/Icon';
import PodcastIllustration from './PodcastIllustration';

function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }
function fmtTime(s) { return `${pad(s / 60)}:${pad(s % 60)}`; }

export default function PodcastPlaybar({ episode, show, onClose }) {
  const [playing,  setPlaying]  = useState(true);
  const [current,  setCurrent]  = useState(0);
  const timerRef = useRef(null);

  const totalSec = episode?.duration ?? 900;
  const cover = show?.podcast?.photo?.photo_135 ?? null;

  const handleScroll = useCallback(() => {}, []); // placeholder

  useEffect(() => {
    setCurrent(0);
    setPlaying(true);
  }, [episode?.id]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => {
          if (prev >= totalSec) { setPlaying(false); return totalSec; }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, totalSec]);

  const seek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setCurrent(Math.round(ratio * totalSec));
  };

  const skip = (delta) =>
    setCurrent(prev => Math.min(Math.max(prev + delta, 0), totalSec));

  const progress = totalSec > 0 ? (current / totalSec) * 100 : 0;

  return (
    <div className="pod-playbar">
      {/* Progress line at top */}
      <div className="pod-playbar__progress" onClick={seek}>
        <div className="pod-playbar__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="pod-playbar__inner">
        {/* Cover */}
        <div className="pod-playbar__cover">
          {cover
            ? <img src={cover} alt={episode?.title} className="pod-playbar__cover-img" />
            : <PodcastIllustration small />
          }
        </div>

        {/* Title */}
        <div className="pod-playbar__info">
          <span className="pod-playbar__title">{episode?.title ?? ''}</span>
          <span className="pod-playbar__times">{fmtTime(current)} / {fmtTime(totalSec)}</span>
        </div>

        {/* Controls */}
        <div className="pod-playbar__controls">
          <button className="icon-btn pod-playbar__ctrl" onClick={() => skip(-15)}>
            <Icon name="Back15Sec" size={22} />
          </button>

          <button
            className="pod-playbar__play"
            onClick={() => setPlaying(p => !p)}
            aria-label={playing ? 'Пауза' : 'Воспроизвести'}
          >
            <Icon name={playing ? 'Pause' : 'Play'} size={20} />
          </button>

          <button className="icon-btn pod-playbar__ctrl" onClick={() => skip(15)}>
            <Icon name="Forward15Sec" size={22} />
          </button>
        </div>

        {/* Close */}
        <button className="icon-btn pod-playbar__close" onClick={onClose}>
          <Icon name="Cross" size={20} />
        </button>
      </div>
    </div>
  );
}
