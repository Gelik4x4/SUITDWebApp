import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpecialOffersPage.css';
import { IconBack } from '../components/icons/Icons';
import SearchBar     from '../components/searchbar/SearchBar';
import OfferCard     from '../components/specialoffers/OfferCard';
import OfferFilters  from '../components/specialoffers/OfferFilters';
import OfferModal    from '../components/specialoffers/OfferModal';
import { SPECIAL_OFFERS } from '../components/specialoffers/specialOffersData';

const EMPTY_FILTERS = { directions: [] };

export default function SpecialOffersPage() {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  const filtered = useMemo(() => SPECIAL_OFFERS.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(item.direction)) return false;
    return true;
  }), [search, filters]);

  return (
    <>
      <div className="sop-page">
        {/* Left: search + grid */}
        <div className="sop-page__left">
          <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
            <IconBack />
          </button>
          <SearchBar
            value={search}
            onChange={setSearch}
            showFavorites
          />
          <div className="sop-grid-wrap">
            {filtered.length === 0 ? (
              <div className="sop-empty">Предложения не найдены</div>
            ) : (
              <div className="sop-grid">
                {filtered.map(item => (
                  <OfferCard key={item.id} offer={item} onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: filters */}
        <div className="sop-page__right">
          <OfferFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(EMPTY_FILTERS)}
          />
        </div>
      </div>

      {/* Modal overlay */}
      {selected && <OfferModal offer={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
