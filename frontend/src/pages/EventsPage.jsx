import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import { IconBack } from '../components/icons/Icons';
import SearchBar      from '../components/searchbar/SearchBar';
import EventCard    from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import EventDetail  from '../components/events/EventDetail';
import { EVENTS }   from '../components/events/eventsData';

const EMPTY_FILTERS = { directions: [] };

function EventsPage() {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  const filtered = useMemo(() => EVENTS.filter(ev => {
    const q = search.toLowerCase();
    if (q && !ev.title.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(ev.direction)) return false;
    return true;
  }), [search, filters]);

  if (selected) {
    return (
      <div className="evp-page">
        <EventDetail event={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="evp-page">
      {/* Left: search + 3-col grid */}
      <div className="evp-page__left">
        <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
          <IconBack />
        </button>
        <SearchBar value={search} onChange={setSearch} />
        <div className="evp-grid-wrap">
          {filtered.length === 0 ? (
            <div className="evp-empty">Мероприятия не найдены</div>
          ) : (
            <div className="evp-grid">
              {filtered.map(ev => (
                <EventCard key={ev.id} event={ev} onClick={() => setSelected(ev)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: filters */}
      <div className="evp-page__right">
        <EventFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>
    </div>
  );
}

export default EventsPage
