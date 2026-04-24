import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './TeacherDetail.css';
import Breadcrumbs          from '../breadcrumbs/Breadcrumbs';
import TeacherScheduleView  from './TeacherScheduleView';
import TeacherChat          from './TeacherChat';
import Icon from '@icon/Icon';

/* ─── Парсинг страницы преподавателя ─────────────────────────── */

const fetchTeacherDetail = async (url) => {
  const proxyPath = url.replace('https://sutd.ru', '/teachers-proxy');
  const res = await fetch(proxyPath);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const photoEl = doc.querySelector('img[src*="upload/iblock"]');
  const photo   = photoEl ? `https://sutd.ru${photoEl.getAttribute('src')}` : null;
  const emailEl = doc.querySelector('a[href^="mailto:"]');
  const email   = emailEl?.textContent?.trim() ?? null;

  const sections = {};
  doc.querySelectorAll('h2, h3, strong').forEach(h => {
    const title = h.textContent?.trim();
    if (!title || title.length > 80) return;
    let content = '';
    let el = h.nextElementSibling;
    while (el && !['H2','H3'].includes(el.tagName)) {
      content += el.textContent + '\n';
      el = el.nextElementSibling;
    }
    if (content.trim()) sections[title] = content.trim();
  });

  return { photo, email, sections };
};

/* ─── Accordion ───────────────────────────────────────────────── */

function AccordionItem({ title, content, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`td-accordion${open ? ' td-accordion--open' : ''}`}>
      <button className="td-accordion__header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <Icon name={open ? 'ArrowDown' : 'ArrowRight'} size={18} />
      </button>
      {open && (
        <div className="td-accordion__body">
          {content.split('\n').filter(Boolean).map((line, i) => (
            <p key={i} className="td-accordion__para">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

/*
  view: 'info' | 'schedule' | 'chat'
*/
export default function TeacherDetail({ teacher, onBack }) {
  const [view, setView] = useState('info');

  const { data: detail, isLoading } = useQuery({
    queryKey: ['teacher-detail', teacher.id],
    queryFn: () => fetchTeacherDetail(teacher.detailUrl),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(teacher.detailUrl),
  });

  const photo    = detail?.photo ?? teacher.photo;
  const sections = detail?.sections ?? {};
  const [firstKey, ...restKeys] = Object.keys(sections);

  /* Хлебные крошки меняются по view */
  const breadcrumbs = [
    { label: 'Сервисы',          onClick: () => window.history.go(-2) },
    { label: 'Преподаватели',    onClick: onBack },
    { label: 'Информация о преподавателе',
      onClick: view !== 'info' ? () => setView('info') : undefined },
    ...(view === 'schedule' ? [{ label: 'Расписание преподавателя' }] : []),
    ...(view === 'chat'     ? [{ label: 'Чат с преподавателем' }]     : []),
  ];

  /* ── Schedule view ── */
  if (view === 'schedule') {
    return (
      <div className="td td--full">
        <Breadcrumbs items={breadcrumbs} />
        <TeacherScheduleView teacher={teacher} />
      </div>
    );
  }

  /* ── Chat view ── */
  if (view === 'chat') {
    return (
      <div className="td td--full">
        <Breadcrumbs items={breadcrumbs} />
        <TeacherChat teacher={{ ...teacher, photo }} />
      </div>
    );
  }

  /* ── Info view ── */
  return (
    <div className="td">
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero */}
      <div className="td-hero">
        <div className="td-hero__photo-wrap">
          {photo
            ? <img src={photo} alt={teacher.name} className="td-hero__photo" />
            : <div className="td-hero__photo-placeholder"><Icon name="User" size={48} /></div>
          }
        </div>
        <div className="td-hero__info">
          <h2 className="td-hero__name">{teacher.name}</h2>
          <p className="td-hero__position">{teacher.position}</p>
          <div className="td-hero__actions">
            <button className="btn--primary td-hero__btn" onClick={() => setView('chat')}>
              Написать преподавателю
            </button>
            <button className="btn--outline td-hero__btn" onClick={() => setView('schedule')}>
              Расписание занятий
            </button>
          </div>
        </div>
      </div>

      {/* Секции-аккордеоны */}
      {isLoading ? (
        <div className="td-loading">Загрузка...</div>
      ) : (
        <div className="td-sections">
          <div className="td-sections__col">
            {firstKey && (
              <AccordionItem key={firstKey} title={firstKey} content={sections[firstKey]} defaultOpen />
            )}
            {restKeys.filter((_,i) => i%2===0).map(k => (
              <AccordionItem key={k} title={k} content={sections[k]} />
            ))}
          </div>
          <div className="td-sections__col">
            {restKeys.filter((_,i) => i%2===1).map(k => (
              <AccordionItem key={k} title={k} content={sections[k]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
