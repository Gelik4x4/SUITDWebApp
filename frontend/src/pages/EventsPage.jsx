import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './EventsPage.css';
import EventCard    from '../components/events/EventCard';
import EventDetail  from '../components/events/EventDetail';
import FavFilterPanel from '../components/filters/FavFilterPanel';
import Breadcrumbs  from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';
import MobileFilterSheet from '../components/filters/MobileFilterSheet';

/* ─── Парсинг мероприятий ─────────────────────────────────────── */

const EVENTS_URL = '/leader-proxy/events?actual=1&cityId=882&offline=0&registrationActual=1&sort=date&placeIds=3905';

const fetchEvents = async () => {
  const res = await fetch(EVENTS_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  /*
   * Реальная структура leader-id SSR:
   * <a href="/events/ID"><img ...></a>
   * <p>Тип</p>
   * <p>Время до окончания регистрации...</p>
   * <h4><a href="/events/ID">Название</a></h4>
   * <p>Дата...</p>
   * <p>Город</p>
   *
   * Ищем h4 > a[href^="/events/"] — это надёжная точка входа.
   */
  const headings = [...doc.querySelectorAll('h4 a[href^="/events/"], h3 a[href^="/events/"]')];

  return headings.map((a, i) => {
    const href  = a.getAttribute('href') ?? '';
    const id    = href.split('/').filter(Boolean).pop() ?? String(i);
    const title = a.textContent.trim();

    /* Ищем img-ссылку с тем же href рядом (раньше в DOM) */
    const imgLink = doc.querySelector(`a[href="${href}"] img, a[href="https://leader-id.ru${href}"] img`);
    const rawSrc  = imgLink?.getAttribute('src') ?? '';
    const image   = rawSrc.startsWith('http') ? rawSrc
                  : rawSrc ? `https://leader-id.ru${rawSrc}` : null;

    /*
     * Соседние элементы h4: ищем параграфы до и после.
     * h4.parentElement содержит всё нужное.
     */
    const parent   = a.closest('h4, h3')?.parentElement;
    const allTexts = parent
      ? [...parent.querySelectorAll('p, span')].map(el => el.textContent.trim()).filter(Boolean)
      : [];

    /* Тип — первый короткий текст без цифр и слова "регистрации" */
    const type = allTexts.find(t =>
      t.length < 30 && !/регистрац|кол-во|\d/.test(t.toLowerCase())
    ) ?? 'Другое';

    /* Дата — содержит числа и месяц */
    const date = allTexts.find(t =>
      /\d/.test(t) && /апрел|мая|июн|июл|август|сентябр|октябр|ноябр|декабр|январ|феврал|март/i.test(t)
    ) ?? '';

    /* Локация */
    const location = allTexts.find(t =>
      /Санкт-Петербург|Москва|онлайн/i.test(t)
    ) ?? 'Санкт-Петербург';

    return { id, title, type, date, location, image, link: `https://leader-id.ru${href}`, description: '' };
  }).filter(ev => ev.title);
};

/* ─── Парсинг детальной страницы мероприятия ─────────────────── */

const fetchEventDetail = async (eventId) => {
  const res = await fetch(`/leader-proxy/events/${eventId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  /* Большое фото мероприятия — берём src из og:image или первую картинку
     из yandexcloud, которая НЕ является логотипом (содержит ID события или user_photo) */
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const allImgs = [...doc.querySelectorAll('img[src*="leader-id.storage.yandexcloud.net"]')]
    .map(img => img.getAttribute('src'))
    .filter(src => src && !src.includes('4345976') && !src.includes('user_photo'));
  const image = ogImage || allImgs[0] || null;

  /* Дата — строка с "по Московскому времени" */
  const allTexts = [...doc.querySelectorAll('p, span, div, h2, h3')]
    .map(el => el.textContent.trim()).filter(Boolean);

  const date = allTexts.find(t =>
    /по Московскому времени/i.test(t) && t.length < 120
  ) ?? '';

  /* Локация — ссылки на places или адрес */
  const placeLink = doc.querySelector('a[href*="/places/"]');
  const location  = placeLink?.textContent?.trim() ?? 'Санкт-Петербург';

  /* Адрес */
  const addressSection = [...doc.querySelectorAll('h3')]
    .find(h => h.textContent.includes('Адрес'));
  const address = addressSection?.nextElementSibling?.textContent?.trim() ?? '';

  /* Описание — секция "О мероприятии" */
  const descSection = [...doc.querySelectorAll('h2')]
    .find(h => h.textContent.includes('О мероприятии'));
  let description = '';
  if (descSection) {
    let el = descSection.nextElementSibling;
    const parts = [];
    while (el && !['H2','H3'].includes(el.tagName)) {
      const t = el.textContent.trim();
      if (t) parts.push(t);
      el = el.nextElementSibling;
    }
    description = parts.join('\n').trim();
  }

  /* Регистрация — дедлайн */
  const regDeadline = allTexts.find(t =>
    /Регистрация закончится/i.test(t) && t.length < 80
  ) ?? '';

  return { image, date, location, address, description, regDeadline };
};



const EVENT_TYPES = [
  'Мероприятия кафедры ЦАТ','Форум','Лекция','Митап',
  'Встреча','Конференция','Мастер-класс','Дизайн','IT','Инженерия','Другое',
];

/* ─── Page ────────────────────────────────────────────────────── */

export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showFav,   setShowFav]   = useState(false);
  // Если пришли с виджета — сразу открываем выбранное мероприятие
  const [openEvent, setOpenEvent] = useState(location.state?.openEvent ?? null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events-list'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const toggleFav = (id) =>
    setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const filtered = useMemo(() => events.filter(ev => {
    if (showFav && !favorites.has(ev.id)) return false;
    const q = search.toLowerCase();
    if (q && !ev.title.toLowerCase().includes(q)) return false;
    if (selected.length && !selected.includes(ev.type)) return false;
    return true;
  }), [events, search, selected, favorites, showFav]);

  /* Детальный просмотр */
  if (openEvent) {
    return (
      <div className="evp-page evp-page--detail">
        <EventDetail
          event={openEvent}
          onBack={() => setOpenEvent(null)}
          isFav={favorites.has(openEvent.id)}
          onToggleFav={() => toggleFav(openEvent.id)}
          fetchDetail={fetchEventDetail}
        />
      </div>
    );
  }

  return (
        <>


        {/* Мобильный хэдер */}
        <MobilePageHeader title="Мероприятия" backTo="/services" />

        {/* Хлебные крошки — только десктоп */}
        <div className="evp-breadcrumbs">
          <Breadcrumbs items={[
            { label: 'Сервисы', onClick: () => navigate('/services') },
            { label: 'Мероприятия' },
          ]} />
        </div>

        {/* Search + фильтр */}
        <div className="evp-search-row">
          <div className="evp-search">
            <Icon name="Search" />
            <input
              className="evp-search__input"
              placeholder="Поиск"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="evp-filter-btn" onClick={() => setFilterOpen(true)} aria-label="Фильтры">
            <Icon name="Filter" size={24} />
          </button>
        </div>

    <div className="evp-page">

      <div className="evp-page__left">
        
        {/* Grid */}
        <div className="evp-grid-wrap">
          {isLoading && <div className="evp-empty">Загрузка мероприятий...</div>}
          {error     && <div className="evp-empty">Не удалось загрузить мероприятия</div>}
          {!isLoading && !error && filtered.length === 0 && (
            <div className="evp-empty">Мероприятия не найдены</div>
          )}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="evp-grid">
              {filtered.map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isFav={favorites.has(ev.id)}
                  onToggleFav={() => toggleFav(ev.id)}
                  onClick={() => setOpenEvent(ev)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — фильтры */}
      <div className="evp-page__right">
        <FavFilterPanel
          options={EVENT_TYPES}
          selected={selected}
          onChange={setSelected}
          showFav={showFav}
          onToggleFav={() => setShowFav(v => !v)}
          onClear={() => { setSelected([]); setShowFav(false); }}
        />
      </div>

    </div>
      {/* Мобильный фильтр */}
      {filterOpen && (
        <MobileFilterSheet
          title="Фильтры"
          options={EVENT_TYPES}
          selected={selected}
          onApply={(cats, fav) => { setSelected(cats); setShowFav(fav); }}
          onClear={() => { setSelected([]); setShowFav(false); }}
          onClose={() => setFilterOpen(false)}
          showFav
          favActive={showFav}
          onToggleFav={() => setShowFav(v => !v)}
        />
      )}
    </>
  );
}
