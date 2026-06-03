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

  const nuxtMatch = html.match(/<script>window\.__NUXT__\s*=\s*([\s\S]*?);<\/script>/);
  if (!nuxtMatch) return [];

  try {
    const nuxtData = new Function('return ' + nuxtMatch[1])();
    const eventsFromNuxt = nuxtData?.state?.events?.events;
    if (eventsFromNuxt && Array.isArray(eventsFromNuxt)) {
      return eventsFromNuxt.map(ev => ({
        id: String(ev.id),
        title: ev.name,
        type: ev.categories?.[0]?.label || 'Другое',
        date: ev.dateShort || ev.date,
        location: ev.location || 'Санкт-Петербург',
        image: ev.photo_360 || ev.photo || null,
        link: `https://leader-id.ru/events/${ev.id}`,
        description: ev.subtitle || ''
      }));
    }
  } catch (e) {
    console.warn('Ошибка парсинга __NUXT__ для списка', e);
  }
  return [];
};

/* ─── Парсинг детальной страницы мероприятия ─────────────────── */

const fetchEventDetail = async (eventId) => {
  const res = await fetch(`/leader-proxy/events/${eventId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // Пробуем извлечь __NUXT__
  const nuxtMatch = html.match(/<script>window\.__NUXT__\s*=\s*([\s\S]*?);<\/script>/);
  if (nuxtMatch) {
    try {
      const nuxtData = new Function('return ' + nuxtMatch[1])();
      const eventData = nuxtData?.state?.event?.event;
      if (eventData) {
        // Логируем для отладки (потом можно убрать)
        console.log('eventData keys:', Object.keys(eventData));
        
        const image = eventData.photo_360 || eventData.photo || null;
        const date = eventData.date || eventData.dateStart || '';
        const location = eventData.place?.name || eventData.location || 'Санкт-Петербург';
        const address = eventData.place?.address || '';
        
        // --- Универсальное извлечение описания ---
        let description = '';
        
        // 1. full_info (часто содержит JSON редактора)
        if (eventData.full_info) {
          try {
            const parsed = typeof eventData.full_info === 'string' 
              ? JSON.parse(eventData.full_info) 
              : eventData.full_info;
            if (parsed && parsed.blocks) {
              description = parsed.blocks
                .map(block => block.data?.text || '')
                .join('\n');
            } else if (typeof parsed === 'string') {
              description = parsed;
            } else if (parsed && parsed.text) {
              description = parsed.text;
            }
          } catch(e) {
            description = eventData.full_info;
          }
        }
        // 2. info.blocks
        if (!description && eventData.info && eventData.info.blocks) {
          description = eventData.info.blocks
            .map(block => block.data?.text || '')
            .join('\n');
        }
        // 3. description или long_description
        if (!description && eventData.description) {
          description = eventData.description;
        }
        if (!description && eventData.long_description) {
          description = eventData.long_description;
        }
        if (!description && eventData.text) {
          description = eventData.text;
        }
        // 4. Если ничего не нашли, пробуем взять первый абзац из info (если строка)
        if (!description && eventData.info && typeof eventData.info === 'string') {
          description = eventData.info;
        }
        
        const regDeadline = eventData.registrationDateEnd
          ? `Регистрация закончится ${eventData.registrationDateEnd}`
          : '';
        
        return { image, date, location, address, description, regDeadline };
      }
    } catch (e) {
      console.warn('Ошибка парсинга __NUXT__ для детальной страницы', e);
    }
  }

  // Fallback: старый парсинг через DOMParser
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const allImgs = [...doc.querySelectorAll('img[src*="leader-id.storage.yandexcloud.net"]')]
    .map(img => img.getAttribute('src'))
    .filter(src => src && !src.includes('4345976') && !src.includes('user_photo'));
  const image = ogImage || allImgs[0] || null;

  const allTexts = [...doc.querySelectorAll('p, span, div, h2, h3')]
    .map(el => el.textContent.trim()).filter(Boolean);
  const date = allTexts.find(t => /по Московскому времени/i.test(t) && t.length < 120) || '';
  const placeLink = doc.querySelector('a[href*="/places/"]');
  const location = placeLink?.textContent?.trim() || 'Санкт-Петербург';
  const addressSection = [...doc.querySelectorAll('h3')].find(h => h.textContent.includes('Адрес'));
  const address = addressSection?.nextElementSibling?.textContent?.trim() || '';
  const descSection = [...doc.querySelectorAll('h2')].find(h => h.textContent.includes('О мероприятии'));
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
  const regDeadline = allTexts.find(t => /Регистрация закончится/i.test(t) && t.length < 80) || '';
  
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
