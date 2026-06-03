import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './EventsWidget.css';
import Icon from '@icon/Icon';
import FavButton from '../buttons/FavButton';

const EVENTS_URL = '/leader-proxy/events?actual=1&cityId=882&offline=0&registrationActual=1&sort=date&placeIds=3905';

export const fetchEvents = async () => {
  const res = await fetch(EVENTS_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // 1. Ищем скрипт, содержащий window.__NUXT__
  const scriptRegex = /<script>window\.__NUXT__\s*=\s*([\s\S]*?);<\/script>/;
  const match = html.match(scriptRegex);
  if (!match) {
    console.warn('Не удалось найти __NUXT__ в HTML');
    return [];
  }

  // 2. Выполняем код, получаем объект с данными
  let nuxtData;
  try {
    // match[1] — это строка от 'function(...){...}(...)' до точки с запятой
    const execute = new Function('return ' + match[1])();
    nuxtData = execute;
  } catch (e) {
    console.error('Ошибка выполнения __NUXT__', e);
    return [];
  }

  // 3. Извлекаем массив событий
  const eventsFromNuxt = nuxtData?.state?.events?.events;
  if (!eventsFromNuxt || !Array.isArray(eventsFromNuxt)) {
    console.warn('В __NUXT__ нет events.events');
    return [];
  }

  // 4. Преобразуем в нужный формат
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
};

function EventCardWidget({ event, onClick }) {
  return (
    <div className="ev-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="ev-card__img">
        {event.image
          ? <img src={event.image} alt={event.title} className="ev-card__photo" />
          : <div className="ev-card__img-placeholder" />
        }
        {event.date && (
          <span className="ev-card__date-badge">{event.date.split(',')[0]}</span>
        )}
        <div className="ev-card__fav-wrap" onClick={e => e.stopPropagation()}>
          <FavButton />
        </div>
      </div>
      <div className="ev-card__body">
        <div className="ev-card__title">{event.title}</div>
      </div>
    </div>
  );
}

export default function EventsWidget() {
  const navigate = useNavigate();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events-list'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const latest = events.slice(0, 3);

  const handleEventClick = (event) => {
    navigate('/services/events', { state: { openEvent: event } });
  };

  const content = (
    <>
      {isLoading && <div className="events-widget-empty">Загрузка...</div>}
      {error     && <div className="events-widget-empty">Нет данных</div>}
      {!isLoading && !error && (
        <div className="events-grid">
          {latest.map(ev => (
            <EventCardWidget key={ev.id} event={ev} onClick={() => handleEventClick(ev)} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Мероприятия для вас</span>
        <button className="icon-btn" onClick={() => navigate('/services/events')}>
          <Icon name="ArrowUp" />
        </button>
      </div>
      {content}
    </div>
  );
}
