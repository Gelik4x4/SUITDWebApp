import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './NewsPage.css';
import NewsCard    from '../components/news/NewsCard';
import NewsDetail  from '../components/news/NewsDetail';
import FilterPanel from '../components/filters/FilterPanel';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';

/* ─── RSS fetch через Vite-прокси ─────────────────────────────── */

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
      id: i,
      title:    get('title'),
      excerpt,
      fullText: [excerpt],
      date,
      category,
      link:  get('link'),
      image: el.querySelector('enclosure')?.getAttribute('url') ?? null,
    };
  });
};

/* ─── Фильтры ─────────────────────────────────────────────────── */

const NEWS_CATEGORIES = [
  'Новости кафедры ЦАТ', 'Разное', 'Культура', 'Спорт',
  'Стипендии и гранты', 'Приказы и распоряжения', 'Образовательные выставки',
  'Поздравления', 'Приоритет-2030', 'Наука', 'Фестивали и форумы',
  'Дополнительное образование', 'Защиты диссертаций', 'Международная деятельность',
];

const FILTER_GROUPS = [{ title: '', options: NEWS_CATEGORIES }];

/* ─── Page ────────────────────────────────────────────────────── */

export default function NewsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);
  const location = useLocation();
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState([]);
  // Если пришли с виджета — сразу открываем выбранную новость
  const [openItem, setOpenItem] = useState(location.state?.openItem ?? null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingSelected, setPendingSelected] = useState(selected);

  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['news-rss'],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const filtered = useMemo(() => news.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.excerpt.toLowerCase().includes(q)) return false;
    if (selected.length && !selected.includes(item.category)) return false;
    return true;
  }), [news, search, selected]);

  /* Детальный просмотр */
  if (openItem) {
    return (
      <div className="news-page news-page--detail">
        <NewsDetail item={openItem} onBack={() => setOpenItem(null)} />
      </div>
    );
  }

  return (
    <div className="news-page">

      {/* Мобильный хэдер */}
      <MobilePageHeader title="Новости" backTo="/services" />

      {/* Хлебные крошки — только десктоп */}
      <Breadcrumbs items={[
        { label: 'Сервисы', onClick: () => navigate('/services') },
        { label: 'Новости' },
      ]} />

      {/* Поиск */}
      <div className="news-search-row">
        <div className="news-search">
          <Icon name="Search" />
          <input
            className="news-search__input"
            placeholder="Поиск"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Кнопка фильтра — только мобиле */}
        <button
          className="news-filter-btn"
          onClick={() => { setPendingSelected(selected); setFilterOpen(true); }}
          aria-label="Фильтры"
        >
          <Icon name="Filter" size={24} />
        </button>
      </div>

      {/* Основное тело: список + фильтры */}
      <div className="news-page__body">

        {/* Список новостей */}
        <div className="news-list">
          {isLoading && <div className="news-empty">Загрузка новостей...</div>}
          {error     && <div className="news-empty">Не удалось загрузить новости</div>}
          {!isLoading && !error && filtered.length === 0 && (
            <div className="news-empty">Новости не найдены</div>
          )}
          {filtered.map(item => (
            <NewsCard key={item.id} item={item} onOpen={setOpenItem} />
          ))}
        </div>

        {/* Фильтры — только десктоп */}
        <div className="news-page__right">
          <FilterPanel
            groups={FILTER_GROUPS}
            selected={selected}
            onChange={setSelected}
            onClear={() => setSelected([])}
          />
        </div>

      </div>

      {/* Bottom sheet фильтров — только мобиле */}
      {filterOpen && (
        <div className="news-filter-overlay" onClick={() => setFilterOpen(false)}>
          <div className="news-filter-sheet" onClick={e => e.stopPropagation()}>
            <div className="news-filter-sheet__header">
              <span className="news-filter-sheet__title">Фильтры</span>
              <button className="news-filter-sheet__close" onClick={() => setFilterOpen(false)}>
                <Icon name="Cross" size={22} />
              </button>
            </div>
            <div className="news-filter-sheet__list">
              {NEWS_CATEGORIES.map(cat => (
                <label key={cat} className="news-filter-sheet__item">
                  <input
                    type="checkbox"
                    className="news-filter-sheet__checkbox"
                    checked={pendingSelected.includes(cat)}
                    onChange={() => setPendingSelected(prev =>
                      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                    )}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
            <div className="news-filter-sheet__actions">
              <button
                className="news-filter-sheet__apply"
                onClick={() => { setSelected(pendingSelected); setFilterOpen(false); }}
              >
                Применить
              </button>
              <button
                className="news-filter-sheet__clear"
                onClick={() => { setPendingSelected([]); setSelected([]); setFilterOpen(false); }}
              >
                Очистить фильтры
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
