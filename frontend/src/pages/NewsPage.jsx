import  { useState, useMemo } from 'react';
import './NewsPage.css';
import SearchBar      from '../components/searchbar/SearchBar';
import NewsCard    from '../components/news/NewsCard';
import NewsFilters from '../components/news/NewsFilters';
import NewsDetail  from '../components/news/NewsDetail';
import { NEWS }    from '../components/news/newsData';

const EMPTY_FILTERS = { directions: [] };

export default function NewsPage({ onBack }) {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => NEWS.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.excerpt.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(item.direction)) return false;
    return true;
  }), [search, filters]);

  if (selected) {
    return (
      <div className="news-page news-page--detail">
        <NewsDetail item={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-page__left">
        <SearchBar value={search} onChange={setSearch} onBack={onBack} />
        <div className="news-list">
          {filtered.length === 0
            ? <div className="news-empty">Новости не найдены</div>
            : filtered.map(item => <NewsCard key={item.id} item={item} onOpen={setSelected} />)
          }
        </div>
      </div>
      <div className="news-page__right">
        <NewsFilters filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
      </div>
    </div>
  );
}
