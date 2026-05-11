import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '../CircularProgress';
import Icon from '@icon/Icon';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import MobilePageHeader from '../MobilePageHeader/MobilePageHeader';
import s from './ArticleDetail.module.css';

/* ─── Content block renderer ─────────────────────────────────── */
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

/* ─── Main component ─────────────────────────────────────────── */
export default function ArticleDetail({ article, onBack }) {
  const navigate  = useNavigate();
  const scrollRef = useRef(null);
  const [progress,   setProgress]   = useState(0);
  const [showToTop,  setShowToTop]  = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const max = scrollHeight - clientHeight;
    setProgress(max > 0 ? Math.round((scrollTop / max) * 100) : 0);
    setShowToTop(scrollTop > 120);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const breadcrumbs = [
    { label: 'Сервисы',            onClick: () => navigate('/services') },
    { label: 'Научные публикации', onClick: onBack },
    { label: 'Информация о публикации' },
  ];

  const hasContent = article.content && article.content.length > 0;

  return (
    <div className={s.artdWrap}>

      {/* Desktop breadcrumbs */}
      <div className={s.artdDesktopBreadcrumbs}>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Mobile header (centred title, back button) */}
      <MobilePageHeader
        title="Научные публикации"
        onBack={onBack}
      />

      {/* Two-column layout: main content + sidebar */}
      <div className={s.artdLayout} ref={scrollRef}>

        {/* ── Left: article body ── */}
        <div className={s.artdScroll}>
          <div className={s.artdContent}>

            {/* ── Mobile: three separate cards ── */}

            {/* Card 1: title + period */}
            <div className={s.artdMobCard}>
              <div className={s.artdTopbar}>
                <h2 className={s.artdTitle}>{article.title}</h2>
                <div className={s.artdTopbarRight}>
                  <button className="icon-btn" aria-label="Поделиться">
                    <Icon name="Share" size={22} />
                  </button>
                </div>
              </div>
              {article.deadline && (
                <p className={s.artdPeriod}>{article.deadline}</p>
              )}
            </div>

            {/* Card 2: deadline sidebar info (mobile only) */}
            {article.deadline && !article.deadline.toLowerCase().includes('завершен') && (
              <div className={`${s.artdMobCard} ${s.artdMobCardDeadline}`}>
                <p className={s.artdSidebarText}>
                  Срок подачи заявки — {article.deadline}.
                </p>
              </div>
            )}

            {/* Card 3: body content */}
            <div className={s.artdMobCard}>
              {/* Hero image */}
              {article.image && (
                <div className={s.artdHero}>
                  <img src={article.image} alt={article.title} className={s.artdHeroImg} />
                </div>
              )}

              {/* Rich content blocks */}
              {hasContent && article.content.map((block, i) => (
                <ContentBlock key={i} block={block} />
              ))}

              {/* Fallback excerpt */}
              {!hasContent && article.excerpt && (
                <p className={s.artdPara}>{article.excerpt}</p>
              )}
            </div>

          </div>
        </div>

        {/* ── Right: sidebar (desktop only) ── */}
        <aside className={s.artdSidebar}>
          {article.deadline && !article.deadline.toLowerCase().includes('завершен') && (
            <div className={s.artdSidebarCard}>
              <p className={s.artdSidebarText}>
                Срок подачи заявки — {article.deadline}.
              </p>
            </div>
          )}

          {article.detailUrl && (
            <a
              href={article.detailUrl}
              target="_blank"
              rel="noreferrer"
              className={s.artdSidebarBtn}
            >
              Информационное письмо
            </a>
          )}
        </aside>
      </div>

      {/* Mobile: fixed bottom button */}
      {article.detailUrl && (
        <a
          href={article.detailUrl}
          target="_blank"
          rel="noreferrer"
          className={s.artdMobBtn}
        >
          Информационное письмо
        </a>
      )}

      {/* To-top button with circular progress */}
      {showToTop && (
        <button className={s.artdTotop} onClick={scrollToTop} aria-label="Наверх">
          <CircularProgress progress={progress} />
          <span className={s.artdTotopIcon}>
            <Icon name="ToTop" />
          </span>
        </button>
      )}
    </div>
  );
}
