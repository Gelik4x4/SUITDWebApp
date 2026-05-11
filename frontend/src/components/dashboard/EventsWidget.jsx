import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './EventsWidget.css';
import Icon from '@icon/Icon';
import FavButton from '../buttons/FavButton';

/* ─── Парсинг — идентично EventsPage ──────────────────────────── */
const EVENTS_URL = '/leader-proxy/events?actual=1&cityId=882&offline=0&registrationActual=1&sort=date&placeIds=3905';

const fetchEvents = async () => {
  const res = await fetch(EVENTS_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  const headings = [...doc.querySelectorAll('h4 a[href^="/events/"], h3 a[href^="/events/"]')];

  return headings.map((a, i) => {
    const href  = a.getAttribute('href') ?? '';
    const id    = href.split('/').filter(Boolean).pop() ?? String(i);
    const title = a.textContent.trim();

    const imgLink = doc.querySelector(`a[href="${href}"] img, a[href="https://leader-id.ru${href}"] img`);
    const rawSrc  = imgLink?.getAttribute('src') ?? '';
    const image   = rawSrc.startsWith('http') ? rawSrc
                  : rawSrc ? `https://leader-id.ru${rawSrc}` : null;

    const parent   = a.closest('h4, h3')?.parentElement;
    const allTexts = parent
      ? [...parent.querySelectorAll('p, span')].map(el => el.textContent.trim()).filter(Boolean)
      : [];

    const type = allTexts.find(t =>
      t.length < 30 && !/регистрац|кол-во|\d/.test(t.toLowerCase())
    ) ?? 'Другое';

    const date = allTexts.find(t =>
      /\d/.test(t) && /апрел|мая|июн|июл|август|сентябр|октябр|ноябр|декабр|январ|феврал|март/i.test(t)
    ) ?? '';

    const location = allTexts.find(t =>
      /Санкт-Петербург|Москва|онлайн/i.test(t)
    ) ?? 'Санкт-Петербург';

    return { id, title, type, date, location, image, link: `https://leader-id.ru${href}`, description: '' };
  }).filter(ev => ev.title);
};

/* ─── Карточка в стиле EventCard ──────────────────────────────── */
function EventCardWidget({ event, onClick }) {
  return (
    <div
      className="ev-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Image */}
      <div className="ev-card__img">
        {event.image
          ? <img src={event.image} alt={event.title} className="ev-card__photo" />
          : <div className="ev-card__img-placeholder" />
        }
        {/* Date badge top-left */}
        {event.date && (
          <span className="ev-card__date-badge">{event.date.split(',')[0]}</span>
        )}
        {/* Fav button top-right */}
        <div className="ev-card__fav-wrap" onClick={e => e.stopPropagation()}>
          <FavButton />
        </div>
      </div>

      {/* Title */}
      <div className="ev-card__body">
        <div className="ev-card__title">{event.title}</div>
      </div>
    </div>
  );
}

/* ─── Widget ───────────────────────────────────────────────────── */
export default function EventsWidget() {
  const navigate = useNavigate();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events-list'],          // тот же ключ — кэш общий с EventsPage
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Берём только первые 3 мероприятия
  const latest = events.slice(0, 3);

  const handleEventClick = (event) => {
    navigate('/services/events', { state: { openEvent: event } });
  };

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Мероприятия для вас</span>
        {/* Нажатие на заголовок — переход на страницу мероприятий */}
        <button className="icon-btn" onClick={() => navigate('/services/events')}>
          <Icon name="ArrowUp" />
        </button>
      </div>

      {isLoading && <div className="events-widget-empty">Загрузка...</div>}
      {error     && <div className="events-widget-empty">Нет данных</div>}

      {!isLoading && !error && (
        <div className="events-grid">
          {latest.map(ev => (
            <EventCardWidget
              key={ev.id}
              event={ev}
              onClick={() => handleEventClick(ev)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
