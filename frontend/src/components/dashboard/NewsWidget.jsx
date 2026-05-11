import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './NewsWidget.css';
import Icon from '@icon/Icon';

/* ─── RSS fetch — идентично NewsPage ──────────────────────────── */
const fetchNews = async () => {
  const res = await fetch('/rss-proxy');
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  if (xml.querySelector('parsererror')) throw new Error('RSS parse error');

  return [...xml.querySelectorAll('item')].map((el, i) => {
    const get = (tag) => el.querySelector(tag)?.textContent?.trim() ?? '';
    const category = get('category') || 'Разное';
    const pubDate  = get('pubDate');
    const date = pubDate
      ? new Date(pubDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
      : '';

    const div = document.createElement('div');
    div.innerHTML = get('description');
    const excerpt = div.textContent.trim();

    return {
      id:       i,
      title:    get('title'),
      excerpt,
      fullText: [excerpt],
      date,
      category,
      link:     get('link'),
      image:    el.querySelector('enclosure')?.getAttribute('url') ?? null,
    };
  });
};

/* ─── Widget ──────────────────────────────────────────────────── */
export default function NewsWidget() {
  const navigate = useNavigate();

  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news-rss'],          // тот же ключ — кэш общий с NewsPage
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // На мобилке показываем 6, на десктопе CSS скроет лишние (.news-item--mobile-only)
  const latest = news.slice(0, 6);

  const handleNewsClick = (item) => {
    // Переходим на страницу новостей и передаём выбранную новость через state
    navigate('/services/news', { state: { openItem: item } });
  };

  return (
    <div className="card news-card">
      <div className="card__header">
        <span className="card__title">Новости</span>
        {/* Нажатие на заголовок — переход на страницу новостей */}
        <button className="icon-btn" onClick={() => navigate('/services/news')}>
          <Icon name="ArrowUp" />
        </button>
      </div>

      {isLoading && <div className="news-widget-empty">Загрузка...</div>}
      {error     && <div className="news-widget-empty">Нет данных</div>}

      {!isLoading && !error && (
        <div className="news-list">
          {latest.map((item, idx) => (
            <div
              key={item.id}
              className={`news-item${idx >= 3 ? ' news-item--mobile-only' : ''}`}
              onClick={() => handleNewsClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleNewsClick(item)}
            >
              {item.image
                ? <img src={item.image} alt={item.title} className="news-item__img" />
                : <div className="news-item__img news-item__img--placeholder" />
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
