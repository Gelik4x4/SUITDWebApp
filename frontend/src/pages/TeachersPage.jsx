import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './TeachersPage.css';
import TeacherListItem from '../components/teachers/TeacherListItem';
import TeacherDetail   from '../components/teachers/TeacherDetail';
import Breadcrumbs     from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';

/* ─── Парсинг списка преподавателей ──────────────────────────── */

const STAFF_URL = '/teachers-proxy/iita/staff/114_1106/';

const fetchTeachers = async () => {
  const res = await fetch(STAFF_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html, 'text/html');

  /* На странице преподаватели — li внутри ul со структурой: img + a + текст */
  const items = [...doc.querySelectorAll('ul li')].filter(li =>
    li.querySelector('a[href*="/person/"]')
  );

  return items.map(li => {
    const link  = li.querySelector('a[href*="/person/"]');
    const img   = li.querySelector('img');
    const name  = link?.textContent?.trim() ?? '';
    const href  = link?.getAttribute('href') ?? '';
    const photo = img?.getAttribute('src') ?? null;
    /* Должность — текст li кроме ссылки */
    const position = li.textContent.replace(name, '').trim();

    return {
      id:       href,
      name,
      position,
      photo:    photo ? `https://sutd.ru${photo}` : null,
      detailUrl: href.startsWith('http') ? href : `https://sutd.ru${href}`,
    };
  }).filter(t => t.name);
};

/* ─── Page ────────────────────────────────────────────────────── */

export default function TeachersPage() {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const { data: teachers = [], isLoading, error } = useQuery({
    queryKey: ['teachers-list'],
    queryFn: fetchTeachers,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const filtered = useMemo(() =>
    teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase())),
    [teachers, search]
  );

  /* Детальный просмотр */
  if (selected) {
    return (
      <div className="tp-page tp-page--detail">
        <TeacherDetail teacher={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="tp-page">
      <Breadcrumbs items={[
        { label: 'Сервисы', onClick: () => navigate('/services') },
        { label: 'Преподаватели' },
      ]} />

      {/* Search — на всю ширину */}
      <div className="tp-search">
        <Icon name="Search" />
        <input
          className="tp-search__input"
          placeholder="Введите ФИО преподавателя..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Список */}
      <div className="tp-page__body"> 
      <div className="tp-list">
        {isLoading && <div className="tp-empty">Загрузка...</div>}
        {error     && <div className="tp-empty">Не удалось загрузить список</div>}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="tp-empty">Преподаватели не найдены</div>
        )}
        {filtered.map(t => (
          <TeacherListItem
            key={t.id}
            teacher={t}
            isSelected={selected?.id === t.id}
            onClick={() => setSelected(t)}
          />
        ))}
      </div>
    </div>
    </div>
  );
}
