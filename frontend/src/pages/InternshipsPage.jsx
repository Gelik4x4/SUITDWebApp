import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './InternshipsPage.css';
import { IconBack } from '../components/icons/Icons';
import SearchBar      from '../components/searchbar/SearchBar';
import InternshipCard    from '../components/internships/InternshipCard';
import InternshipFilters from '../components/internships/InternshipFilters';
import InternshipDetail  from '../components/internships/InternshipDetail';
import { INTERNSHIPS }   from '../components/internships/internshipsData';

const EMPTY_FILTERS = { directions: [], employment: [], format: [] };

function InternshipsPage() {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  const filtered = useMemo(() => INTERNSHIPS.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.company.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(item.direction)) return false;
    if (filters.employment.length && !filters.employment.includes(item.employment)) return false;
    if (filters.format.length && !filters.format.includes(item.format)) return false;
    return true;
  }), [search, filters]);

  if (selected) {
    return (
      <div className="intp-page">
        <InternshipDetail item={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="intp-page">
      <div className="intp-page__left">
        <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
          <IconBack />
        </button>        
        <SearchBar value={search} onChange={setSearch} />
        <div className="intp-list">
          {filtered.length === 0
            ? <div className="intp-empty">Стажировки не найдены</div>
            : filtered.map(item => <InternshipCard key={item.id} item={item} onOpen={setSelected} />)
          }
        </div>
      </div>
      <div className="intp-page__right">
        <InternshipFilters filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
      </div>
    </div>
  );
}

export default InternshipsPage
