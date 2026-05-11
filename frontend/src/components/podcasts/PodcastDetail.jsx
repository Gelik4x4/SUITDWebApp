import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PodcastDetail.css';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import MobilePageHeader from '../MobilePageHeader/MobilePageHeader';
import { EPISODES } from '@constants/podcastsData';

/* Загружаем VK openapi.js один раз */
function loadVKScript() {
  return new Promise((resolve) => {
    if (window.VK) { resolve(); return; }
    if (document.getElementById('vk-openapi-script')) {
      const wait = setInterval(() => {
        if (window.VK) { clearInterval(wait); resolve(); }
      }, 50);
      return;
    }
    const script = document.createElement('script');
    script.id = 'vk-openapi-script';
    script.src = 'https://vk.com/js/api/openapi.js?173';
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

/* Один виджет-эпизод */
function EpisodeWidget({ episode }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadVKScript().then(() => {
      if (cancelled || !ref.current) return;
      ref.current.innerHTML = '';
      requestAnimationFrame(() => {
        if (cancelled) return;
        try {
          window.VK.Widgets.Podcast(episode.widgetId, episode.podcastId, episode.hash);
        } catch (e) {
          console.warn('VK Widget error:', e);
        }
      });
    });
    return () => { cancelled = true; };
  }, [episode.id]);

  return (
    <div className="pod-episode">
      <div className="pod-episode__meta">
        <span className="pod-episode__date">{episode.date}</span>
        <h4 className="pod-episode__title">{episode.title}</h4>
      </div>
      <div id={episode.widgetId} ref={ref} className="pod-episode__widget" />
    </div>
  );
}

/* Главный компонент */
export default function PodcastDetail({ show, onBack }) {
  const navigate = useNavigate();

  // Фильтруем выпуски этого шоу
  const episodes = EPISODES.filter(ep => ep.showId === show.id);

  const breadcrumbs = [
    { label: 'Сервисы',  onClick: () => navigate('/services') },
    { label: 'Подкасты', onClick: onBack },
    { label: 'Информация о подкасте' },
  ];

  return (
    <div className="pod-detail">
      {/* Desktop: хлебные крошки */}
      <div className="pod-detail__desktop-bc">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Mobile: заголовок по центру */}
      <MobilePageHeader title="Подкасты" onBack={onBack} />

      {/* Hero banner */}
      <div className="pod-detail__hero">
        <div className="pod-detail__hero-cover">
          {show.cover && (
            <img src={show.cover} alt={show.title} className="pod-detail__hero-img" />
          )}
        </div>
        <div className="pod-detail__hero-info">
          <h2 className="pod-detail__hero-title">{show.title}</h2>
          <p className="pod-detail__hero-author">{show.author}</p>
          {show.description && (
            <p className="pod-detail__hero-desc">
              {show.description.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* Эпизоды */}
      {episodes.length > 0 && (
        <>
          <h3 className="pod-detail__section-title">Эпизоды</h3>
          <div className="pod-detail__episodes">
            {episodes.map(ep => (
              <EpisodeWidget key={ep.id} episode={ep} />
            ))}
          </div>
        </>
      )}

      {episodes.length === 0 && (
        <p className="pod-detail__empty">Выпуски не добавлены</p>
      )}
    </div>
  );
}
