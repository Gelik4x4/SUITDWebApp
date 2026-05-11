import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './ArticlesPage.css';
import ArticleCard      from '../components/articles/ArticleCard';
import ArticleDetail    from '../components/articles/ArticleDetail';
import FilterPanel      from '../components/filters/FilterPanel';
import MobileFilterSheet from '../components/filters/MobileFilterSheet';
import Breadcrumbs      from '../components/breadcrumbs/Breadcrumbs';
import Icon             from '@icon/Icon';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';

/* ─── Категории фильтра ───────────────────────────────────────── */
const FILTER_GROUPS = [
  {
    title: '',
    options: [
      'Сборники кафедры ЦАТ',
      'Дизайн',
      'Культура',
      'Спорт',
      'Инженерия',
      'Другое',
    ],
  },
];

const FILTER_OPTIONS = FILTER_GROUPS[0].options;

/* ─── Парсинг страницы конференций ───────────────────────────── */
const CONF_URL = '/conferences-proxy/nauka/conferences/';

const CONTEST_KEYWORDS = ['конкурс', 'конкурса', 'конкурсу', 'конкурсов'];
const isContest = (text) => {
  const lower = text.toLowerCase();
  return CONTEST_KEYWORDS.some(kw => lower.includes(kw));
};

const fetchArticles = async () => {
  const res = await fetch(CONF_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const blockquotes = [...doc.querySelectorAll('blockquote')];
  const results = [];

  blockquotes.forEach((bq, idx) => {
    const paragraphs = [...bq.querySelectorAll('p')];
    const link = bq.querySelector('a[href]');

    const titleRaw = paragraphs[0]?.textContent?.trim()
      ?? bq.firstChild?.textContent?.trim()
      ?? '';
    const title = titleRaw || bq.textContent.split('\n')[0].trim();

    if (!title || title.length < 5) return;
    if (isContest(title)) return;

    const datesText = paragraphs[1]?.textContent?.trim() ?? '';

    const deadlineMatch = datesText.match(/прием заявок[:\s]*([^дД]+?)(?:\s+даты|$)/i);
    const deadline = deadlineMatch
      ? deadlineMatch[1].trim().replace(/\s+/g, ' ')
      : '';

    const datesMatch = datesText.match(/даты?\s+проведения[:\s]*(.+)/i);
    const dates = datesMatch ? datesMatch[1].trim() : '';

    const href = link?.getAttribute('href') ?? '';
    const detailUrl = href.startsWith('http') ? href : `https://sutd.ru${href}`;

    const excerpt = dates
      ? `Дата проведения: ${dates}`
      : datesText;

    const lower = title.toLowerCase();
    let direction = 'Другое';
    if (lower.includes('дизайн') || lower.includes('мода') || lower.includes('искусств') || lower.includes('художник')) direction = 'Дизайн';
    else if (lower.includes('культур') || lower.includes('язык') || lower.includes('гуманитар') || lower.includes('история')) direction = 'Культура';
    else if (lower.includes('спорт') || lower.includes('физическ')) direction = 'Спорт';
    else if (lower.includes('нано') || lower.includes('технолог') || lower.includes('цифров') || lower.includes('инженер') || lower.includes('материал') || lower.includes('энергет')) direction = 'Инженерия';

    results.push({
      id: detailUrl + idx,
      title,
      excerpt,
      deadline,
      detailUrl,
      direction,
      image: null,
    });
  });

  return results;
};

/* ─── Page ────────────────────────────────────────────────────── */
const EMPTY_FILTERS = { directions: [] };

export default function ArticlesPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);
  const [search,        setSearch]        = useState('');
  const [filters,       setFilters]       = useState(EMPTY_FILTERS);
  const [selected,      setSelected]      = useState(null);
  const [mobileFilter,  setMobileFilter]  = useState(false);

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ['articles-conferences'],
    queryFn: fetchArticles,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const filtered = useMemo(() => articles.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.excerpt?.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(item.direction)) return false;
    return true;
  }), [articles, search, filters]);

  const hasActiveFilters = filters.directions.length > 0;

  /* ── Detail view ── */
  if (selected) {
    return (
      <div className="art-page art-page--detail">
        <ArticleDetail
          article={selected}
          onBack={() => setSelected(null)}
          navigate={navigate}
        />
      </div>
    );
  }

  /* ── List view ── */
  return (
    <>
      <MobilePageHeader title="Научные публикации" backTo="/services" />

      {/* Desktop breadcrumbs */}
      <div className="art-desktop-breadcrumbs">
        <Breadcrumbs items={[
          { label: 'Сервисы', onClick: () => navigate('/services') },
          { label: 'Научные публикации' },
        ]} />
      </div>

      {/* Search row */}
      <div className="art-search-row">
        <div className="art-search">
          <Icon name="Search" />
          <input
            className="art-search__input"
            placeholder="Введите ключевые слова..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`art-filter-btn${hasActiveFilters ? ' art-filter-btn--active' : ''}`}
          onClick={() => setMobileFilter(true)}
          aria-label="Фильтры"
        >
          <Icon name="Filter" size={24} />
        </button>
      </div>

    <div className="art-page">
      <div className="art-page__left">

        <div className="art-list-wrap">
        <div className="art-list">
          {isLoading && <div className="art-empty">Загрузка...</div>}
          {error     && <div className="art-empty">Не удалось загрузить публикации</div>}
          {!isLoading && !error && filtered.length === 0 && (
            <div className="art-empty">Публикации не найдены</div>
          )}
          {filtered.map(item => (
            <ArticleCard key={item.id} article={item} onOpen={setSelected} />
          ))}
        </div>
        </div>
      </div>

      {/* Right: filters (desktop only) */}
      <div className="art-page__right">
        <FilterPanel
          groups={FILTER_GROUPS}
          selected={filters.directions}
          onChange={(dirs) => setFilters({ directions: dirs })}
          onClear={() => setFilters(EMPTY_FILTERS)}
          clearLabel="Очистить фильтры"
        />
      </div>

      {/* Mobile filter sheet */}
      {mobileFilter && (
        <MobileFilterSheet
          title="Фильтры"
          options={FILTER_OPTIONS}
          selected={filters.directions}
          onApply={(dirs) => setFilters({ directions: dirs })}
          onClear={() => setFilters(EMPTY_FILTERS)}
          onClose={() => setMobileFilter(false)}
        />
      )}
    </div>
    </>
  );
}
