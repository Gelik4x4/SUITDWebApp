import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './PodcastsPage.css';
import { IconBack } from '../components/icons/Icons';
import SearchBar      from '../components/searchbar/SearchBar';
import PodcastCard    from '../components/podcasts/PodcastCard';
import PodcastFilters from '../components/podcasts/PodcastFilters';
import PodcastDetail  from '../components/podcasts/PodcastDetail';
import { PODCASTS }   from '../components/podcasts/podcastsData';

const EMPTY_FILTERS = { directions: [] };

function PodcastsPage() {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  const filtered = useMemo(() => PODCASTS.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !p.fullTitle.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(p.direction)) return false;
    return true;
  }), [search, filters]);

  if (selected) {
    return (
      <div className="podp-page">
        <PodcastDetail podcast={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="podp-page">
      {/* Left: search + 3-col grid */}
      <div className="podp-page__left">
        <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
          <IconBack />
        </button>
        <SearchBar value={search} onChange={setSearch} />
        <div className="podp-grid-wrap">
          {filtered.length === 0 ? (
            <div className="podp-empty">Подкасты не найдены</div>
          ) : (
            <div className="podp-grid">
              {filtered.map(p => (
                <PodcastCard key={p.id} podcast={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: filters */}
      <div className="podp-page__right">
        <PodcastFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>
    </div>
  );
}

export default PodcastsPage
