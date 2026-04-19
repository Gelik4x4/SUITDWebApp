import { useRef, useState, useEffect, useCallback } from 'react';
import CircularProgress from '../CircularProgress';
import Icon from '@icon/Icon';
import s from './ArticleDetail.module.css';

/*  Content block  */
function ContentBlock({ block }) {
  switch (block.type) {
    case 'text':
      return <p className={s.artdPara}>{block.value}</p>;
    case 'heading':
      return <h3 className={s.artdHeading}>{block.value}</h3>;
    case 'list':
      return (
        <ul className={s.artdList}>
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'toc':
      return (
        <ul className={s.artdToc}>
          {block.items.map((item, i) => (
            <li key={i} className={s.artdTocItem}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

/*  Main component  */
function ArticleDetail({ article, onBack }) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
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
    <div className={s.artdWrap}>
      {/*  Top bar  */}
      <div className={s.artdTopbar}>
        <div className={s.artdTopbarLeft}>
          {/* Совместил глобальный класс icon-btn и локальный s.artdBack */}
          <button className={`icon-btn ${s.artdBack}`} onClick={onBack}>
            <Icon name="ArrowLeft" />
          </button>
          <h2 className={s.artdTitle}>{article.title}</h2>
        </div>
        <div className={s.artdTopbarRight}>
          <span className={s.artdReadtime}>
            <Icon name="Clock" /> Время прочтения: {article.readTime}
          </span>
          <button className="icon-btn">
            <Icon name="Share" />
          </button>
          <button className="icon-btn">
            <Icon name="Heart" />
          </button>
        </div>
      </div>

      {/*  Scrollable article body  */}
      <div className={s.artdScroll} ref={scrollRef}>
        <div className={s.artdContent}>
          {/* Hero image */}
          {article.image && (
            <div className={s.artdHero}>
              <img src={article.image} alt={article.title} className={s.artdHeroImg} />
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
          className={s.artdTotop}
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <CircularProgress progress={progress} />
          <span className={s.artdTotopIcon}>
            <Icon name="ToTop" />
          </span>
        </button>
      )}
    </div>
  );
}

export default ArticleDetail;
