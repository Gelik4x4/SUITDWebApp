import React, { useRef, useState, useEffect, useCallback } from 'react';
import './ArticleDetail.css';

/*  Icons  */
const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconArrowUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

/*  Content block  */
function ContentBlock({ block }) {
  switch (block.type) {
    case 'text':
      return <p className="artd-para">{block.value}</p>;
    case 'heading':
      return <h3 className="artd-heading">{block.value}</h3>;
    case 'list':
      return (
        <ul className="artd-list">
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'toc':
      return (
        <ul className="artd-toc">
          {block.items.map((item, i) => (
            <li key={i} className="artd-toc__item">{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

/*  Circular progress SVG  */
function CircularProgress({ progress }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <svg className="artd-totop__ring" width="48" height="48" viewBox="0 0 48 48">
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

/*  Main component  */
export default function ArticleDetail({ article, onBack }) {
  const scrollRef = useRef(null);
  const [progress,  setProgress]  = useState(0);
  const [showToTop, setShowToTop] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const max = scrollHeight - clientHeight;
    const pct = max > 0 ? Math.round((scrollTop / max) * 100) : 0;
    setProgress(pct);
    setShowToTop(scrollTop > 120);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="artd-wrap">
      {/*  Top bar  */}
      <div className="artd-topbar">
        <div className="artd-topbar__left">
          <button className="icon-btn artd-back" onClick={onBack}>
            <IconBack />
          </button>
          <h2 className="artd-title">{article.title}</h2>
        </div>
        <div className="artd-topbar__right">
          <span className="artd-readtime">
            <IconClock /> Время прочтения: {article.readTime}
          </span>
          <button className="icon-btn"><IconShare /></button>
          <button className="icon-btn"><IconHeart /></button>
        </div>
      </div>

      {/*  Scrollable article body  */}
      <div className="artd-scroll" ref={scrollRef}>
        <div className="artd-content">
          {/* Hero image */}
          {article.image && (
            <div className="artd-hero">
              <img src={article.image} alt={article.title} className="artd-hero__img" />
            </div>
          )}

          {/* Content blocks */}
          {article.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>
      </div>

      {/*  To-top button with progress indicator  */}
      {showToTop && (
        <button
          className="artd-totop"
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <CircularProgress progress={progress} />
          <span className="artd-totop__icon">
            <IconArrowUp />
          </span>
        </button>
      )}
    </div>
  );
}
