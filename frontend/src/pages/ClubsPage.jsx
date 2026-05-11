import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClubsPage.css';
import ClubCard    from '../components/clubs/ClubCard';
import ClubDetail  from '../components/clubs/ClubDetail';
import FilterPanel from '../components/filters/FilterPanel';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';
import MobileFilterSheet from '../components/filters/MobileFilterSheet';
import { CLUBS, CLUB_CATEGORIES } from '@constants/clubsData';

const FILTER_GROUPS = [{ title: '', options: CLUB_CATEGORIES }];

export default function ClubsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState([]);
  const [openClub,  setOpenClub]  = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);



  const filtered = useMemo(() => CLUBS.filter(club => {
    const q = search.toLowerCase();
    if (q && !club.name.toLowerCase().includes(q) && !club.description.toLowerCase().includes(q)) return false;
    if (selected.length && !selected.includes(club.category)) return false;
    return true;
  }), [search, selected]);

  if (openClub) {
    return (
      <div className="clubs-page clubs-page--detail">
        <ClubDetail club={openClub} onBack={() => setOpenClub(null)} />
      </div>
    );
  }

  return (
    <>
      <MobilePageHeader title="Клубы" backTo="/services" />
      <div className="clubs-breadcrumbs">
        <Breadcrumbs items={[
          { label: 'Сервисы', onClick: () => navigate('/services') },
          { label: 'Клубы' },
        ]} />
      </div>

      <div className="clubs-search-row">
        <div className="clubs-search">
          <Icon name="Search" />
          <input
            className="clubs-search__input"
            placeholder="Поиск"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="clubs-filter-btn" onClick={() => setFilterOpen(true)} aria-label="Фильтры">
          <Icon name="Filter" size={24} />
        </button>
      </div>
    <div className="clubs-page">
      <div className="clubs-page__left">




        <div className="clubs-grid">
          {filtered.length === 0 && (
            <div className="clubs-empty">Клубы не найдены</div>
          )}
          {filtered.map(club => (
            <ClubCard key={club.id} club={club} onClick={() => setOpenClub(club)} />
          ))}
        </div>
      </div>

      <div className="clubs-page__right clubs-page__right--desktop">
        <FilterPanel
          groups={FILTER_GROUPS}
          selected={selected}
          onChange={setSelected}
          onClear={() => setSelected([])}
        />
      </div>
    </div>
      {filterOpen && (
        <MobileFilterSheet
          title="Фильтры"
          options={CLUB_CATEGORIES}
          selected={selected}
          onApply={(cats) => setSelected(cats)}
          onClear={() => setSelected([])}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </>
  );
}
