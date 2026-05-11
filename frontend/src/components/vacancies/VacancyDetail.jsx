import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import './VacancyDetail.css';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import FavButton   from '../buttons/FavButton';
import Icon from '@icon/Icon';
import MobilePageHeader from '../MobilePageHeader/MobilePageHeader';

/* ─── Загрузка детальной информации о вакансии ─────────────────
   HH API: GET /vacancies/{id}  — возвращает полное описание
*/
const fetchVacancyDetail = async (id) => {
  const res = await fetch(`/hh-proxy/vacancies/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const v = await res.json();

  /* Чистим HTML из описания */
  const tmp = document.createElement('div');
  tmp.innerHTML = v.description ?? '';

  /* Собираем секции из тегов <strong> / <h2> / <h3> */
  const sections = [];
  tmp.querySelectorAll('strong, h2, h3').forEach(h => {
    const title = h.textContent.trim();
    if (!title || title.length > 100) return;
    const items = [];
    let el = h.nextElementSibling ?? h.parentElement?.nextElementSibling;
    while (el && !['STRONG','H2','H3'].includes(el.tagName)) {
      const liItems = [...el.querySelectorAll('li')].map(li => li.textContent.trim());
      if (liItems.length) items.push(...liItems);
      else if (el.textContent.trim()) items.push(el.textContent.trim());
      el = el.nextElementSibling;
    }
    if (items.length) sections.push({ title, items });
  });

  return {
    sections,
    salary: v.salary
      ? `от ${v.salary.from?.toLocaleString('ru-RU') ?? '?'} ₽ в месяц, на руки`
      : 'Зарплата не указана',
    experience:   v.experience?.name ?? '',
    employment:   v.employment?.name ?? '',
    schedule:     v.schedule?.name ?? '',
    workingHours: v.working_time_modes?.[0]?.name ?? '',
    format:       v.work_format?.[0]?.name ?? '',
    companyLogo:  v.employer?.logo_urls?.original ?? v.employer?.logo_urls?.['240'] ?? null,
    companyName:  v.employer?.name ?? '',
    rating:       null, // HH не отдаёт рейтинг публично
    url:          v.alternate_url,
  };
};

function Section({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="vd-section">
      <h3 className="vd-section__title">{title}</h3>
      <ul className="vd-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      {/* Мобильная фиксированная кнопка */}
      <div className="vd__mobile-apply">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="vd__apply btn--primary">
          Откликнуться
        </a>
      </div>
    </div>
  );
}

export default function VacancyDetail({ vacancy, onBack, isFav, onToggleFav }) {
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  const { data: detail, isLoading } = useQuery({
    queryKey: ['vacancy-detail', vacancy.id],
    queryFn: () => fetchVacancyDetail(vacancy.id),
    staleTime: 10 * 60 * 1000,
  });

  const salary      = detail?.salary      ?? vacancy.salary;
  const experience  = detail?.experience  ?? vacancy.experience;
  const employment  = detail?.employment  ?? vacancy.employment;
  const schedule    = detail?.schedule    ?? vacancy.schedule;
  const format      = detail?.format      ?? '';
  const companyLogo = detail?.companyLogo ?? vacancy.companyLogo;
  const companyName = detail?.companyName ?? vacancy.company;
  const sections    = detail?.sections    ?? [];
  const url         = detail?.url         ?? vacancy.url;

  return (
    <div className="vd">
      <MobilePageHeader title="Вакансии" onBack={onBack} />
      <div className="vd__breadcrumbs"><Breadcrumbs items={[
        { label: 'Сервисы',   onClick: () => window.history.go(-2) },
        { label: 'Вакансии',  onClick: onBack },
        { label: 'Информация о вакансии' },
      ]} /></div>

      {/* ── Десктоп layout ── */}
      <div className="vd__body vd__body--desktop">

        {/* Left — main content */}
        <div className="vd__main">
          <div className="vd__titlerow">
            <h2 className="vd__title">{vacancy.title}</h2>
            <div className="vd__actions">
              <FavButton active={isFav} onClick={onToggleFav} />
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="icon-btn" title="Открыть на hh.ru">
                <Icon name="Share" />
              </a>
            </div>
          </div>
          {isLoading ? (
            <div className="vd__loading">Загрузка описания...</div>
          ) : (
            <div className="vd__sections">
              {sections.length > 0
                ? sections.map((s, i) => <Section key={i} title={s.title} items={s.items} />)
                : <p className="vd__desc">{vacancy.description}</p>
              }
            </div>
          )}
        </div>

        <aside className="vd__meta">
          <div className="vd__company">
            {companyLogo
              ? <img src={companyLogo} alt={companyName} className="vd__company-logo" />
              : <div className="vd__company-logo-placeholder">{companyName[0]}</div>
            }
            <div className="vd__company-name">{companyName}</div>
          </div>
          <div className="vd__divider" />
          <div className="vd__params">
            {salary     && <div className="vd__param">{salary}</div>}
            {experience && <div className="vd__param"><span className="vd__param-label">Опыт работы:</span> {experience}</div>}
            {employment && <div className="vd__param"><span className="vd__param-label">{employment} занятость</span></div>}
            {schedule   && <div className="vd__param"><span className="vd__param-label">График:</span> {schedule}</div>}
            {format     && <div className="vd__param"><span className="vd__param-label">Формат работы:</span> {format}</div>}
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="vd__apply btn--primary">
            Откликнуться
          </a>
        </aside>
      </div>

      {/* ── Мобильный layout: 3 карточки ── */}
      <div className="vd__mobile-layout">

        {/* Карточка 1: название + параметры */}
        <div className="vd__mobile-card">
          <div className="vd__titlerow">
            <h2 className="vd__title">{vacancy.title}</h2>
            <div className="vd__actions">
              <FavButton active={isFav} onClick={onToggleFav} />
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="icon-btn" title="Открыть на hh.ru">
                <Icon name="Share" />
              </a>
            </div>
          </div>
          <div className="vd__params">
            {salary     && <div className="vd__param">{salary}</div>}
            {experience && <div className="vd__param"><span className="vd__param-label">Опыт работы:</span> {experience}</div>}
            {employment && <div className="vd__param"><span className="vd__param-label">{employment} занятость</span></div>}
            {schedule   && <div className="vd__param"><span className="vd__param-label">График:</span> {schedule}</div>}
            {format     && <div className="vd__param"><span className="vd__param-label">Формат работы:</span> {format}</div>}
          </div>
        </div>

        {/* Карточка 2: работодатель */}
        <div className="vd__mobile-card">
          <div className="vd__company">
            {companyLogo
              ? <img src={companyLogo} alt={companyName} className="vd__company-logo" />
              : <div className="vd__company-logo-placeholder">{companyName[0]}</div>
            }
            <div className="vd__company-name">{companyName}</div>
          </div>
        </div>

        {/* Карточка 3: описание вакансии */}
        <div className="vd__mobile-card">
          {isLoading ? (
            <div className="vd__loading">Загрузка описания...</div>
          ) : (
            <div className="vd__sections">
              {sections.length > 0
                ? sections.map((s, i) => <Section key={i} title={s.title} items={s.items} />)
                : <p className="vd__desc">{vacancy.description}</p>
              }
            </div>
          )}
        </div>

      </div>
      {/* Мобильная фиксированная кнопка */}
      <div className="vd__mobile-apply">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="vd__apply btn--primary">
          Откликнуться
        </a>
      </div>
    </div>
  );
}
