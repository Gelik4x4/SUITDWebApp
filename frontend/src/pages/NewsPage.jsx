import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './NewsPage.css';
import NewsCard    from '../components/news/NewsCard';
import NewsDetail  from '../components/news/NewsDetail';
import FilterPanel from '../components/filters/FilterPanel';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';

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
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState([]);
  const [openItem, setOpenItem] = useState(null);

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

      {/* Хлебные крошки */}
      <Breadcrumbs items={[
        { label: 'Сервисы', onClick: () => navigate('/services') },
        { label: 'Новости' },
      ]} />

      {/* Поиск — на всю ширину, над колонками */}
      <div className="news-search">
        <Icon name="Search" />
        <input
          className="news-search__input"
          placeholder="Введите ключевые слова..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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

        {/* Фильтры */}
        <div className="news-page__right">
          <FilterPanel
            groups={FILTER_GROUPS}
            selected={selected}
            onChange={setSelected}
            onClear={() => setSelected([])}
          />
        </div>

      </div>
    </div>
  );
}
