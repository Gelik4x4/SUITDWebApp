import  { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContestsPage.css';
import SearchBar      from '../components/searchbar/SearchBar';
import ContestCard    from '../components/contests/ContestCard';
import ContestFilters from '../components/contests/ContestFilters';
import ContestDetail  from '../components/contests/ContestDetail';
import { CONTESTS }   from '@constants/contestsData';
import Icon from '@icon/Icon';

const EMPTY_FILTERS = { directions: [], status: null };

function ContestsPage() {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

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
        <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
          <Icon name="ArrowLeft"/>
        </button>
        <SearchBar value={search} onChange={setSearch} />
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

export default ContestsPage
