import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './VacanciesPage.css';
import VacancyCard        from '../components/vacancies/VacancyCard';
import VacancyDetail      from '../components/vacancies/VacancyDetail';
import VacancyFilterPanel from '../components/filters/VacancyFilterPanel';
import Breadcrumbs        from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';

/* ─── Trudvsem API ────────────────────────────────────────────────
   Открытый API Роструда — не требует регистрации.
   Документация: https://opendata.trudvsem.ru/doc
   Регион 78 = Санкт-Петербург (код ОКТМО: 7800000000000)
────────────────────────────────────────────────────────────────── */

const REGION = '7800000000000'; // Санкт-Петербург

const fetchVacancies = async () => {
  const queries = ['дизайнер', 'frontend', 'разработчик', 'UI UX'];

  const results = await Promise.all(
    queries.map(text =>
      fetch(`/trudvsem-proxy/api/v1/vacancies/region/${REGION}?text=${encodeURIComponent(text)}&limit=10&offset=0`)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .catch(() => null)
    )
  );

  /* Если все запросы упали — бросаем ошибку */
  if (results.every(r => r === null)) throw new Error('API недоступен');

  /* Trudvsem структура: results.vacancies[] → каждый элемент { vacancy: {...} } */
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
      title:       v.job_name ?? 'Вакансия',
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

/* ─── Фильтры ─────────────────────────────────────────────────── */
const EXPERIENCE_OPTS = ['Без опыта', 'До 1 года', '1–3 года', 'Более 3 лет'];
const EMPLOYMENT_OPTS = ['Полная занятость', 'Частичная занятость'];
const FORMAT_OPTS     = ['Удалённо', 'Офис', 'Гибрид'];
const DIRECTION_OPTS  = ['Дизайн', 'IT', 'Frontend', 'Backend', 'Контент', 'Другое'];

/* ─── Page ────────────────────────────────────────────────────── */
export default function VacanciesPage() {
  const navigate = useNavigate();
  const [search,    setSearch]    = useState('');
  const [expSel,    setExpSel]    = useState([]);
  const [empSel,    setEmpSel]    = useState([]);
  const [fmtSel,    setFmtSel]    = useState([]);
  const [dirSel,    setDirSel]    = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showFav,   setShowFav]   = useState(false);
  const [openVac,   setOpenVac]   = useState(null);

  const { data: vacancies = [], isLoading, error } = useQuery({
    queryKey: ['trudvsem-vacancies'],
    queryFn: fetchVacancies,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const toggleFav = id =>
    setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const clearAll = () => { setExpSel([]); setEmpSel([]); setFmtSel([]); setDirSel([]); setShowFav(false); };

  const filtered = useMemo(() => vacancies.filter(v => {
    if (showFav && !favorites.has(v.id)) return false;
    const q = search.toLowerCase();
    if (q && !v.title.toLowerCase().includes(q) && !v.company.toLowerCase().includes(q)) return false;
    if (expSel.length && !expSel.some(e => v.experience.includes(e))) return false;
    if (empSel.length && !empSel.some(e => v.employment.includes(e))) return false;
    if (fmtSel.length && !fmtSel.includes(v.format)) return false;
    return true;
  }), [vacancies, search, showFav, favorites, expSel, empSel, fmtSel]);

  if (openVac) {
    return (
      <div className="vac-page vac-page--detail">
        <VacancyDetail
          vacancy={openVac}
          onBack={() => setOpenVac(null)}
          isFav={favorites.has(openVac.id)}
          onToggleFav={() => toggleFav(openVac.id)}
        />
      </div>
    );
  }

  return (
    <>
    <Breadcrumbs items={[
          { label: 'Сервисы', onClick: () => navigate('/services') },
          { label: 'Вакансии' },
        ]} />

        <div className="vac-search">
          <Icon name="Search" />
          <input
            className="vac-search__input"
            placeholder="Введите ключевые слова..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
    <div className="vac-page">
      <div className="vac-page__left">
        

        <div className="vac-list">
          {isLoading && <div className="vac-empty">Загрузка вакансий...</div>}
          {error && (
            <div className="vac-empty">
              Не удалось подключиться к базе вакансий.<br />
              Проверьте подключение и перезапустите сервер.
            </div>
          )}
          {!isLoading && !error && filtered.length === 0 && (
            <div className="vac-empty">Вакансии не найдены</div>
          )}
          {filtered.map(v => (
            <VacancyCard
              key={v.id}
              vacancy={v}
              isFav={favorites.has(v.id)}
              onToggleFav={() => toggleFav(v.id)}
              onOpen={() => setOpenVac(v)}
            />
          ))}
        </div>
      </div>

      <div className="vac-page__right">
        <VacancyFilterPanel
          showFav={showFav}      onToggleFav={() => setShowFav(v => !v)}
          expOptions={EXPERIENCE_OPTS} expSelected={expSel} onExpChange={setExpSel}
          empOptions={EMPLOYMENT_OPTS} empSelected={empSel} onEmpChange={setEmpSel}
          fmtOptions={FORMAT_OPTS}     fmtSelected={fmtSel} onFmtChange={setFmtSel}
          dirOptions={DIRECTION_OPTS}  dirSelected={dirSel} onDirChange={setDirSel}
          onClear={clearAll}
        />
      </div>
    </div>
    </>
  );
}
