import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './ContestsPage.css';
import ContestCard    from '../components/contests/ContestCard';
import ContestDetail  from '../components/contests/ContestDetail';
import FavFilterPanel from '../components/filters/FavFilterPanel';
import Breadcrumbs    from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';
import { CONTESTS as STATIC_CONTESTS } from '@constants/contestsData';

/* ─── Парсинг с sutd.ru/nauka/conferences/ ───────────────────── */

/* Ключевые слова для фильтрации — только конкурсы */
const CONTEST_KEYWORDS = ['конкурс', 'олимпиад', 'грант', 'хакатон', 'конгресс', 'фестиваль'];
const CONF_KEYWORDS    = ['конференци', 'симпозиум', 'семинар', 'форум'];

const isContest = (text) => {
  const t = text.toLowerCase();
  const hasContest = CONTEST_KEYWORDS.some(k => t.includes(k));
  const hasConf    = CONF_KEYWORDS.some(k => t.includes(k));
  return hasContest || !hasConf; // берём если есть слово конкурс, или если нет слова конференция
};

const fetchSutdContests = async () => {
  const res = await fetch('/sutd-proxy/nauka/conferences/');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  /* Элементы конкурсов — blockquote с текстом */
  const blocks = [...doc.querySelectorAll('blockquote')];

  return blocks
    .filter(block => isContest(block.textContent))
    .map((block, i) => {
      const text = block.textContent.trim();

      /* Заголовок — первая строка или до первого переноса */
      const lines  = text.split('\n').map(l => l.trim()).filter(Boolean);
      const title  = lines[0] ?? 'Конкурс';

      /* Ссылка */
      const link   = block.querySelector('a');
      const href   = link?.getAttribute('href') ?? '';
      const url    = href.startsWith('http') ? href : `https://sutd.ru${href}`;

      /* Дедлайн — ищем "прием заявок" */
      const deadlineMatch = text.match(/приём?\s+заявок[:\s]+([^\n\r]+)/i)
        ?? text.match(/до\s+\d[^,\n]{0,30}/i);
      const deadline = deadlineMatch
        ? `Приём заявок: ${deadlineMatch[1]?.trim() ?? deadlineMatch[0]}`
        : '';

      /* Даты проведения */
      const datesMatch = text.match(/даты?\s+проведени[яе][:\s]+([^\n\r]+)/i);
      const dates = datesMatch?.[1]?.trim() ?? '';

      /* Определяем категорию */
      const t = title.toLowerCase();
      const category =
        t.includes('дизайн')     ? 'Дизайн'
        : t.includes('it') || t.includes('информ') || t.includes('цифров') ? 'IT'
        : t.includes('инженер')  ? 'Инженерия'
        : t.includes('наук') || t.includes('молодых учен') ? 'Конкурсы кафедры ЦАТ'
        : 'Другое';

      return {
        id:          `sutd-${i}`,
        title,
        description: lines.slice(1, 3).join(' ').slice(0, 200),
        deadline,
        date:        dates,
        direction:   category,
        category,
        status:      deadline.toLowerCase().includes('завершен') ? 'finished' : 'active',
        image:       null,
        url,
        schedule:    [
          deadline ? { title: 'Приём заявок', date: deadline.replace(/приём\s+заявок[:\s]*/i, '') } : null,
          dates    ? { title: 'Даты проведения', date: dates } : null,
        ].filter(Boolean),
        fullText:    text,
      };
    })
    .filter(c => c.title.length > 5 && c.status !== 'finished');
};

/* ─── Объединяем с константами ───────────────────────────────── */
const mergeContests = (parsed) => {
  /* Конвертируем статические данные в общий формат */
  const staticFormatted = STATIC_CONTESTS.map(c => ({
    ...c,
    category:  c.direction ?? 'Другое',
    url:       c.url ?? '#',
    schedule:  c.schedule ?? [
      { title: 'Приём заявок', date: c.deadline ?? '' },
      { title: 'Дата',         date: c.date ?? '' },
    ].filter(s => s.date),
    id: String(c.id),
  }));

  /* Статические идут первыми (они приоритетнее), затем с сайта */
  const allIds = new Set(staticFormatted.map(c => c.title.toLowerCase()));
  const uniqueParsed = parsed.filter(c => !allIds.has(c.title.toLowerCase()));
  return [...staticFormatted, ...uniqueParsed];
};

/* ─── Категории фильтра ───────────────────────────────────────── */
const CONTEST_CATS = [
  'Конкурсы кафедры ЦАТ', 'Фото и видео', 'Рисунок',
  'Дизайн', 'IT', 'Литература', 'Инженерия', 'Другое',
];

/* ─── Page ────────────────────────────────────────────────────── */
export default function ContestsPage() {
  const navigate = useNavigate();
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState([]);
  const [favorites,   setFavorites]   = useState(new Set());
  const [showFav,     setShowFav]     = useState(false);
  const [openContest, setOpenContest] = useState(null);

  const { data: parsedContests = [], isLoading, error } = useQuery({
    queryKey: ['sutd-contests'],
    queryFn: fetchSutdContests,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });

  /* Объединяем данные */
  const allContests = useMemo(
    () => mergeContests(parsedContests),
    [parsedContests]
  );

  const toggleFav = id =>
    setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const filtered = useMemo(() => allContests.filter(c => {
    if (showFav && !favorites.has(c.id)) return false;
    const q = search.toLowerCase();
    if (q && !c.title.toLowerCase().includes(q) && !c.description?.toLowerCase().includes(q)) return false;
    if (selected.length && !selected.includes(c.category)) return false;
    return true;
  }), [allContests, search, selected, favorites, showFav]);

  if (openContest) {
    return (
      <div className="con-page con-page--detail">
        <ContestDetail
          contest={openContest}
          onBack={() => setOpenContest(null)}
          isFav={favorites.has(openContest.id)}
          onToggleFav={() => toggleFav(openContest.id)}
        />
      </div>
    );
  }

  /* Показываем статические пока грузится парсинг */
  const showLoading = isLoading && parsedContests.length === 0;

  return (
    <>
    <Breadcrumbs items={[
          { label: 'Сервисы', onClick: () => navigate('/services') },
          { label: 'Конкурсы' },
        ]} />

        <div className="con-search">
          <Icon name="Search" />
          <input
            className="con-search__input"
            placeholder="Введите ключевые слова..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
    <div className="con-page">
      <div className="con-page__left">

        <div className="con-grid-wrap">
          {showLoading && <div className="con-empty">Загрузка конкурсов...</div>}
          {!showLoading && filtered.length === 0 && (
            <div className="con-empty">Конкурсы не найдены</div>
          )}
          {filtered.length > 0 && (
            <div className="con-grid">
              {filtered.map(c => (
                <ContestCard
                  key={c.id}
                  contest={c}
                  isFav={favorites.has(c.id)}
                  onToggleFav={() => toggleFav(c.id)}
                  onClick={() => setOpenContest(c)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="con-page__right">
        <FavFilterPanel
          options={CONTEST_CATS}
          selected={selected}
          onChange={setSelected}
          showFav={showFav}
          onToggleFav={() => setShowFav(v => !v)}
          onClear={() => { setSelected([]); setShowFav(false); }}
        />
      </div>
    </div>
    </>
  );
}
