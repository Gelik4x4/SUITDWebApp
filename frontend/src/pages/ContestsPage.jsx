import  { useState, useMemo } from 'react';
import './ContestsPage.css';
import SearchBar      from '../components/searchbar/SearchBar';
import ContestCard    from '../components/contests/ContestCard';
import ContestFilters from '../components/contests/ContestFilters';
import ContestDetail  from '../components/contests/ContestDetail';
import { CONTESTS }   from '../components/contests/contestsData';


const EMPTY_FILTERS = { directions: [], status: null };

export default function ContestsPage({ onBack }) {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => CONTESTS.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.directions.length && !filters.directions.includes(c.direction)) return false;
    return true;
  }), [search, filters]);

  if (selected) {
    return (
      <div className="con-page">
        <ContestDetail contest={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="con-page">
      <div className="con-page__left">
        <SearchBar value={search} onChange={setSearch} onBack={onBack} />
        <div className="con-grid-wrap">
          {filtered.length === 0
            ? <div className="con-empty">Конкурсы не найдены</div>
            : <div className="con-grid">
                {filtered.map(c => <ContestCard key={c.id} contest={c} onClick={() => setSelected(c)} />)}
              </div>
          }
        </div>
      </div>
      <div className="con-page__right">
        <ContestFilters filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
      </div>
    </div>
  );
}