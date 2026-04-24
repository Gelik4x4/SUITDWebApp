import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClubsPage.css';
import ClubCard    from '../components/clubs/ClubCard';
import ClubDetail  from '../components/clubs/ClubDetail';
import FilterPanel from '../components/filters/FilterPanel';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';
import { CLUBS, CLUB_CATEGORIES } from '@constants/clubsData';

const FILTER_GROUPS = [{ title: '', options: CLUB_CATEGORIES }];

export default function ClubsPage() {
  const navigate = useNavigate();
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState([]);
  const [openClub,  setOpenClub]  = useState(null);

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
      <Breadcrumbs
        items={[
          { label: 'Сервисы', onClick: () => navigate('/services') },
          { label: 'Клубы' },
        ]}
      />
        <div className="clubs-search">
          <Icon name="Search" />
          <input
            className="clubs-search__input"
            placeholder="Введите ключевые слова..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
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

      <div className="clubs-page__right">
        <FilterPanel
          groups={FILTER_GROUPS}
          selected={selected}
          onChange={setSelected}
          onClear={() => setSelected([])}
        />
      </div>
    </div>
    </>
  );
}
