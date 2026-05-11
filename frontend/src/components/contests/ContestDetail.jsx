import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import './ContestDetail.css';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import FavButton   from '../buttons/FavButton';
import Icon from '@icon/Icon';

/* ─── Загрузка детальной страницы конкурса ───────────────────── */
const fetchContestDetail = async (url) => {
  /* Выбираем прокси по домену */
  let proxyPath = url;
  if (url.includes('sutd.ru'))
    proxyPath = url.replace('https://sutd.ru', '/sutd-proxy');
  else if (url.includes('xn--j1aaidmgm0e.xn--p1ai'))
    proxyPath = url.replace('https://xn--j1aaidmgm0e.xn--p1ai', '/contests-proxy');
  else
    proxyPath = null; // внешняя ссылка, не парсим
  if (!proxyPath) return null;
  const res = await fetch(proxyPath);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  /* Большое изображение */
  const ogImg = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const mainImg = doc.querySelector('main img, .contest img, article img');
  const rawSrc = mainImg?.getAttribute('src') ?? '';
  const image = ogImg
    ?? (rawSrc.startsWith('http') ? rawSrc : rawSrc ? `https://xn--j1aaidmgm0e.xn--p1ai${rawSrc}` : null);

  /* Описание */
  const descEl = doc.querySelector('.description, .contest-description, article p, main p');
  const description = descEl?.textContent?.trim() ?? '';

  /* Все параграфы */
  const paragraphs = [...doc.querySelectorAll('main p, article p, .content p')]
    .map(p => p.textContent.trim())
    .filter(t => t.length > 20)
    .slice(0, 10);

  /* Расписание — ищем блоки с датами */
  const scheduleItems = [...doc.querySelectorAll('[class*="stage"], [class*="schedule"], [class*="period"], dl, .timeline')]
    .slice(0, 5)
    .map(el => {
      const title = el.querySelector('dt, strong, b, h4')?.textContent?.trim() ?? '';
      const date  = el.querySelector('dd, span, p')?.textContent?.trim() ?? el.textContent.trim();
      return title ? { title, date } : null;
    })
    .filter(Boolean);

  return { image, paragraphs, scheduleItems };
};

/* ─── Share helper ────────────────────────────────────────────── */
function useShare(url) {
  const [copied, setCopied] = useState(false);
  const share = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, share };
}

/* ─── Component ───────────────────────────────────────────────── */
export default function ContestDetail({ contest, onBack, isFav, onToggleFav }) {
  const { copied, share } = useShare(contest.url);

  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  /* Нативный share на мобиле */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: contest.title, url: contest.url }).catch(() => {});
    } else {
      share();
    }
  };

  const { data: detail, isLoading } = useQuery({
    queryKey: ['contest-detail', contest.id],
    queryFn: () => fetchContestDetail(contest.url),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(contest.url),
  });

  const image      = detail?.image ?? contest.image ?? null;
  /* Для статических конкурсов используем fullText напрямую */
  const paragraphs = detail?.paragraphs
    ?? (contest.fullText ? contest.fullText.split('\n\n').filter(Boolean) : [])
    ?? (contest.description ? [contest.description] : []);
  const schedule   = detail?.scheduleItems ?? contest.schedule ?? [];

  return (
    <div className="con-detail">
      {/* Мобильный hero: фото + кнопки поверх */}
      <div className="con-detail__mobile-hero">
        {image
          ? <img src={image} alt={contest.title} className="con-detail__mobile-hero__img" />
          : <div className="con-detail__mobile-hero__placeholder" />
        }
        <div className="con-detail__mobile-hero__overlay">
          <button className="con-detail__mobile-hero__btn" onClick={onBack} aria-label="Назад">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="con-detail__mobile-hero__right">
            <button className="con-detail__mobile-hero__btn" onClick={onToggleFav}>
              <Icon name={isFav ? 'HeartFilled' : 'Heart'} size={20} />
            </button>
            <button className="con-detail__mobile-hero__btn" onClick={handleShare}>
              <Icon name="Share" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="con-detail__breadcrumbs"><Breadcrumbs items={[
        { label: 'Сервисы',   onClick: () => window.history.go(-2) },
        { label: 'Конкурсы',  onClick: onBack },
        { label: 'Информация о конкурсе' },
      ]} /></div>

      {/* ── Десктоп ── */}
      <div className="con-detail__body con-detail__body--desktop">

        {/* Left — основной контент */}
        <div className="con-detail__main">
          <div className="con-detail__titlerow">
            <h2 className="con-detail__title">{contest.title}</h2>
            <div className="con-detail__actions">
              <FavButton active={isFav} onClick={onToggleFav} />
              <div className="con-detail__share-wrap">
                <button className="icon-btn" onClick={share} title="Скопировать ссылку">
                  <Icon name="Share" />
                </button>
                {copied && <div className="con-detail__share-tooltip">Скопировано!</div>}
              </div>
            </div>
          </div>

          {image && (
            <div className="con-detail__banner">
              <img src={image} alt={contest.title} className="con-detail__banner-img" />
            </div>
          )}

          {isLoading ? (
            <div className="con-detail__loading">Загрузка информации...</div>
          ) : (
            <div className="con-detail__text">
              {paragraphs.map((p, i) => (
                <p key={i} className="con-detail__para">{p}</p>
              ))}
            </div>
          )}
        </div>

        {/* Right — sidebar с расписанием */}
        <aside className="con-detail__meta">
          <div className="con-detail__meta-title">Расписание</div>

          {schedule.length > 0 ? (
            schedule.map((item, i) => (
              <div key={i} className="con-meta-stage">
                <div className="con-meta-stage__label">{item.title}</div>
                <div className="con-meta-stage__date">{item.date}</div>
              </div>
            ))
          ) : contest.deadline ? (
            <div className="con-meta-stage">
              <div className="con-meta-stage__label">Приём заявок</div>
              <div className="con-meta-stage__date">{contest.deadline}</div>
            </div>
          ) : null}

          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="con-detail__cta btn--primary"
          >
            Подробнее
          </a>
        </aside>

      </div>
      {/* ── Мобильный layout ── */}
      <div className="con-detail__mobile-layout">

        {/* Карточка 1: название + расписание */}
        <div className="con-detail__mobile-card">
          <h2 className="con-detail__title">{contest.title}</h2>

          {(schedule.length > 0 || contest.deadline) && (
            <>
              <div className="con-detail__meta-title">Расписание</div>
              {schedule.length > 0 ? (
                schedule.map((item, i) => (
                  <div key={i} className="con-meta-stage">
                    <div className="con-meta-stage__label">{item.title}</div>
                    <div className="con-meta-stage__date">{item.date}</div>
                  </div>
                ))
              ) : (
                <div className="con-meta-stage">
                  <div className="con-meta-stage__label">Приём заявок</div>
                  <div className="con-meta-stage__date">{contest.deadline}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Карточка 2: описание */}
        {(paragraphs.length > 0 || isLoading) && (
          <div className="con-detail__mobile-card">
            <div className="con-detail__meta-title">О мероприятии</div>
            {isLoading ? (
              <div className="con-detail__loading">Загрузка информации...</div>
            ) : (
              <div className="con-detail__text">
                {paragraphs.map((p, i) => (
                  <p key={i} className="con-detail__para">{p}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Фиксированная кнопка снизу */}
      <div className="con-detail__mobile-cta">
        <a href={contest.url} target="_blank" rel="noopener noreferrer"
          className="con-detail__cta btn--primary">
          Подробнее
        </a>
      </div>
    </div>
  );
}
