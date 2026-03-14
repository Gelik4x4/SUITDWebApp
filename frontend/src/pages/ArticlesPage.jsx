import React, { useState, useMemo } from 'react';
import './ArticlesPage.css';
import SearchBar      from '../components/searchbar/SearchBar';
import ArticleCard    from '../components/articles/ArticleCard';
import ArticleFilters from '../components/articles/ArticleFilters';
import ArticleDetail  from '../components/articles/ArticleDetail';
import { ARTICLES }   from '../components/articles/articlesData';

const EMPTY_FILTERS = { directions: [] };

export default function ArticlesPage({ onBack }) {
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => ARTICLES.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.excerpt.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(item.direction)) return false;
    return true;
  }), [search, filters]);

  /*  Detail view  */
  if (selected) {
    return (
      <div className="art-page art-page--detail">
        <ArticleDetail article={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div className="art-page">
      <div className="art-page__left">
        <SearchBar value={search} onChange={setSearch} onBack={onBack} />
        <div className="art-list">
          {filtered.length === 0 ? (
            <div className="art-empty">Статьи не найдены</div>
          ) : (
            filtered.map(item => (
              <ArticleCard key={item.id} article={item} onOpen={setSelected} />
            ))
          )}
        </div>
      </div>

      <div className="art-page__right">
        <ArticleFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>
    </div>
  );
}
