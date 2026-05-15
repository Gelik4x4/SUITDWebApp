import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './VacanciesWidget.css';
import Icon from '@icon/Icon';
import FavButton from '../buttons/FavButton';

import vacancy1 from '@/assets/img/vacancy/vacancy-1.png';
import vacancy2 from '@/assets/img/vacancy/vacancy-2.png';
import vacancy3 from '@/assets/img/vacancy/vacancy-3.png';
import vacancy4 from '@/assets/img/vacancy/vacancy-4.png';

/* ─── Trudvsem API — идентично VacanciesPage ──────────────────── */
const REGION = '7800000000000';

const fetchVacancies = async () => {
  const queries = ['дизайнер', 'frontend', 'разработчик', 'UI UX'];

  const results = await Promise.all(
    queries.map(text =>
      fetch(`/trudvsem-proxy/api/v1/vacancies/region/${REGION}?text=${encodeURIComponent(text)}&limit=10&offset=0`)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .catch(() => null)
    )
  );

  if (results.every(r => r === null)) throw new Error('API недоступен');

  const seen = new Set();
  const all = results
    .filter(Boolean)
    .flatMap(r => r?.results?.vacancies ?? [])
    .filter(item => {
      const id = item?.vacancy?.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

  return all.map(item => {
    const v = item.vacancy;
    const salary = v.salary_min
      ? `от ${Number(v.salary_min).toLocaleString('ru-RU')} ₽`
      : v.salary ? v.salary : 'Зарплата не указана';

    const experience = v.experience ?? '';
    const employment = v.employment ?? '';
    const schedule   = v.schedule   ?? '';

    return {
      id:          v.id,
      title:       v['job-name'] ?? v.job_name ?? v.title ?? v.name ?? v.position ?? 'Вакансия',
      company:     v.company?.name ?? '',
      companyLogo: v.company?.logo ?? null,
      salary,
      salaryRaw:   v.salary_min ?? 0,
      experience,
      employment,
      schedule,
      format:      schedule.toLowerCase().includes('удал') ? 'Удалённо'
                 : schedule.toLowerCase().includes('офис')  ? 'Офис' : 'Офис',
      url:         v.vac_url ?? `https://trudvsem.ru/vacancy/card/${v.id}`,
      description: v.duty ?? '',
      address:     v.addresses?.address?.[0]
        ? `${v.addresses.address[0].location}`
        : v.region?.name ?? '',
      tasks:        v.duty        ? [v.duty]       : [],
      requirements: v.requirement ? [v.requirement]: [],
      conditions:   v.condition   ? [v.condition]  : [],
      offers:       [],
      tags: [employment, experience, schedule].filter(Boolean).slice(0, 3),
    };
  });
};

/* ─── Статические картинки для карточек (у API нет изображений) ── */
const CARD_IMAGES = [
  vacancy1,
  vacancy2,
  vacancy3,
  vacancy4,
];

/* ─── Карточка ─────────────────────────────────────────────────── */
function JobCard({ vacancy, img, onClick }) {
  return (
    <div className="job-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      {img && <img src={img} alt={vacancy.title} className="job-card__bg-img" />}

      {/* Верхняя строка: тег + кнопка избранного */}
      <div className="job-card__top-row">
        {vacancy.experience && (
          <span className="badge badge--orange">{vacancy.experience}</span>
        )}
        <div onClick={e => e.stopPropagation()}>
          <FavButton />
        </div>
      </div>

      <div className="job-card__content">
        <div className="job-card__title">{vacancy.title}</div>
        <div className="job-card__company">{vacancy.company}</div>
      </div>
    </div>
  );
}

/* ─── Widget ───────────────────────────────────────────────────── */
export default function VacanciesWidget() {
  const navigate = useNavigate();

  const { data: vacancies = [], isLoading, error } = useQuery({
    queryKey: ['trudvsem-vacancies'],   // тот же ключ — кэш общий с VacanciesPage
    queryFn: fetchVacancies,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Берём только первые 4 вакансии
  const latest = vacancies.slice(0, 4);

  const handleVacancyClick = (vacancy) => {
    navigate('/services/vacancies', { state: { openVac: vacancy } });
  };

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Популярные вакансии</span>
        {/* Нажатие на заголовок — переход на страницу вакансий */}
        <button className="icon-btn" onClick={() => navigate('/services/vacancies')}>
          <Icon name="ArrowUp" />
        </button>
      </div>

      {isLoading && <div className="vacancies-widget-empty">Загрузка...</div>}
      {error     && <div className="vacancies-widget-empty">Нет данных</div>}

      {!isLoading && !error && (
        <div className="vacancies-grid">
          {latest.map((v, i) => (
            <JobCard
              key={v.id}
              vacancy={v}
              img={CARD_IMAGES[i % CARD_IMAGES.length]}
              onClick={() => handleVacancyClick(v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
