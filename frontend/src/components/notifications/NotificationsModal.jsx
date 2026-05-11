import { useState, useRef, useEffect } from 'react';
import './NotificationsModal.css';
import Icon from '@icon/Icon';

/* ── Demo data ──────────────────────────────────────────────────── */
const NOTIFICATIONS = [
  {
    id: 1,
    category: 'Учёба',
    title: 'Изменение в расписании',
    text: 'Пара «Проектирование интерфейсов» перенесена в аудиторию 215',
    date: 'Сегодня, 13:00',
    unread: true,
    link: null,
  },
  {
    id: 2,
    category: 'События',
    title: 'Новое мероприятие',
    text: 'Открыта регистрация на хакатон по разработке веб-сервисов. Количество мест ограничено.',
    date: '15 апреля 2026',
    unread: false,
    link: '#',
  },
  {
    id: 3,
    category: 'Учёба',
    title: 'Напоминание',
    text: 'Сегодня в 16:55 состоится лекция «Цифровые технологии в дизайне»',
    date: '12 апреля 2026',
    unread: false,
    link: '#',
  },
  {
    id: 4,
    category: 'Вакансии',
    title: 'Вас может заинтересовать вакансия Начинающий дизайнер',
    text: 'Выплаты: два раза в месяц, Опыт работы: не требуется, Полная занятость',
    date: '10 апреля 2026',
    unread: false,
    link: '#',
  },
  {
    id: 5,
    category: 'Конкурсы',
    title: 'Новый конкурс для студентов',
    text: 'Всероссийский конкурс студенческих проектов в области цифрового дизайна',
    date: '8 апреля 2026',
    unread: false,
    link: '#',
  },
  {
    id: 6,
    category: 'Учёба',
    title: 'Результаты проверки работы',
    text: 'Преподаватель проверил вашу курсовую работу. Ознакомьтесь с комментариями.',
    date: '5 апреля 2026',
    unread: false,
    link: null,
  },
];

const FILTERS = ['Все', 'Учёба', 'События', 'Вакансии', 'Конкурсы'];

/* ── Single notification item ───────────────────────────────────── */
function NotifItem({ notif }) {
  return (
    <div className={`notif-item${notif.unread ? ' notif-item--unread' : ''}`}>
      <div className="notif-item__content">
        <div className="notif-item__top">
          <span className="notif-item__title">
            {notif.title}
            {notif.unread && <span className="notif-item__dot" />}
          </span>
          {notif.link && (
            <a href={notif.link} className="notif-item__link icon-btn" aria-label="Открыть">
              <Icon name="ArrowUpRight" size={18} />
            </a>
          )}
        </div>
        <p className="notif-item__text">{notif.text}</p>
        <span className="notif-item__date">{notif.date}</span>
      </div>
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────────── */
export default function NotificationsModal({ onClose }) {
  const [search,     setSearch]     = useState('');
  const [activeFilter, setFilter]   = useState('Все');
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = NOTIFICATIONS.filter(n => {
    const matchCat  = activeFilter === 'Все' || n.category === activeFilter;
    const matchText = !search || n.title.toLowerCase().includes(search.toLowerCase())
      || n.text.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div
      className="notif-overlay"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="notif-modal">
        {/* Header */}
        <div className="notif-modal__header">
          <h2 className="notif-modal__title">Уведомления</h2>
          <button className="icon-btn notif-modal__close" onClick={onClose} aria-label="Закрыть">
            <Icon name="Cross" size={28} />
          </button>
        </div>

        {/* Search */}
        <div className="notif-search">
          <Icon name="Search" size={18} />
          <input
            className="notif-search__input"
            placeholder="Введите название группы..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="notif-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`notif-filter${activeFilter === f ? ' notif-filter--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="notif-list">
          {filtered.length === 0 && (
            <p className="notif-empty">Уведомлений не найдено</p>
          )}
          {filtered.map(n => <NotifItem key={n.id} notif={n} />)}
        </div>
      </div>
    </div>
  );
}
