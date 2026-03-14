import { useState, useMemo } from 'react';
import './VacanciesPage.css';
import SearchBar      from '../components/searchbar/SearchBar';
import VacancyCard    from '../components/vacancies/VacancyCard';
import VacancyFilters from '../components/vacancies/VacancyFilters';
import VacancyDetail  from '../components/vacancies/VacancyDetail';
import { VACANCIES }  from '../components/vacancies/vacanciesData';

const EMPTY_FILTERS = { directions: [], experience: [], employment: [], format: [] };

export default function VacanciesPage({ onBack }) {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => VACANCIES.filter(v => {
    const q = search.toLowerCase();
    if (q && !v.title.toLowerCase().includes(q) && !v.company.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.some(d => v.direction.includes(d))) return false;
    if (filters.experience.length && !filters.experience.includes(v.experience)) return false;
    if (filters.employment.length && !filters.employment.includes(v.employment)) return false;
    if (filters.format.length && !filters.format.includes(v.format)) return false;
    return true;
  }), [search, filters]);

  if (selected) {
    return (
      <div className="vac-page">
        <VacancyDetail vacancy={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="vac-page">
      <div className="vac-page__left">
        <SearchBar value={search} onChange={setSearch} onBack={onBack} />
        <div className="vac-list">
          {filtered.length === 0
            ? <div className="vac-empty">Вакансии не найдены</div>
            : filtered.map(v => <VacancyCard key={v.id} vacancy={v} onOpen={setSelected} />)
          }
        </div>
      </div>
      <div className="vac-page__right">
        <VacancyFilters filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
      </div>
    </div>
  );
}