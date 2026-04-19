import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeachersPage.css';
import { IconBack } from '../components/icons/Icons';
import SearchBar      from '../components/searchbar/SearchBar';
import TeacherListItem  from '../components/teachers/TeacherListItem';
import TeacherFilters   from '../components/teachers/TeacherFilters';
import TeacherDetail    from '../components/teachers/TeacherDetail';
import { TEACHERS }     from '../components/teachers/teachersData';

const EMPTY_FILTERS = { institutes: [] };

function TeachersPage() {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  const filtered = useMemo(() => TEACHERS.filter(t => {
    const q = search.toLowerCase();
    if (q && !t.name.toLowerCase().includes(q)) return false;
    if (filters.institutes.length && !filters.institutes.includes(t.institute)) return false;
    return true;
  }), [search, filters]);

  /* ── Detail view ── */
  if (selected) {
    return (
      <div className="tp-page tp-page--detail">
        <TeacherDetail teacher={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div className="tp-page">
      {/* Left: search + list */}
      <div className="tp-page__left">
        <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
          <IconBack />
        </button>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Введите ФИО преподавателя..."
        />
        <div className="tp-list">
          {filtered.length === 0 ? (
            <div className="tp-empty">Преподаватели не найдены</div>
          ) : (
            filtered.map(t => (
              <TeacherListItem
                key={t.id}
                teacher={t}
                isSelected={selected?.id === t.id}
                onClick={() => setSelected(t)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right: filters */}
      <div className="tp-page__right">
        <TeacherFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>
    </div>
  );
}

export default TeachersPage
