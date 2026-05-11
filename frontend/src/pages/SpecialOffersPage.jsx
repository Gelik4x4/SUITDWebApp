import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SpecialOffersPage.css';
import OfferCard        from '../components/specialoffers/OfferCard';
import FavFilterPanel   from '../components/filters/FavFilterPanel';
import MobileFilterSheet from '../components/filters/MobileFilterSheet';
import OfferDetailPage  from '../components/specialoffers/OfferDetailPage';
import Breadcrumbs      from '../components/breadcrumbs/Breadcrumbs';
import Icon             from '@icon/Icon';
import MobilePageHeader from '../components/MobilePageHeader/MobilePageHeader';
import { SPECIAL_OFFERS, OFFER_DIRECTIONS } from '@constants/specialOffersData';

const EMPTY_FILTERS = { directions: [] };

export default function SpecialOffersPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);
  const location = useLocation();

  const [search,        setSearch]        = useState('');
  const [filters,       setFilters]       = useState(EMPTY_FILTERS);
  const [showFav,       setShowFav]       = useState(false);
  const [favIds,        setFavIds]        = useState([]);
  const [mobileFilter,  setMobileFilter]  = useState(false);
  // Если пришли с виджета — сразу открываем выбранное предложение
  const [selected,      setSelected]      = useState(location.state?.openItem ?? null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  const toggleFav = (id) => {
    setFavIds(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => SPECIAL_OFFERS.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.description?.toLowerCase().includes(q)) return false;
    if (filters.directions.length && !filters.directions.includes(item.direction)) return false;
    if (showFav && !favIds.includes(item.id)) return false;
    return true;
  }), [search, filters, showFav, favIds]);

  const breadcrumbs = [
    { label: 'Сервисы', onClick: () => navigate('/services') },
    { label: 'Специальные предложения' },
  ];

  const hasActiveFilters = filters.directions.length > 0 || showFav;

  /* ── Detail view ── */
  if (selected) {
    return (
      <OfferDetailPage
        offer={selected}
        onBack={() => setSelected(null)}
        isFav={favIds.includes(selected.id)}
        onToggleFav={toggleFav}
      />
    );
  }

  /* ── List view ── */
  return (
    <>
      <MobilePageHeader title="Специальные предложения" backTo="/services" />

      {/* Desktop: breadcrumbs */}
      <div className="sop-desktop-breadcrumbs">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Search row (desktop + mobile) */}
      <div className="sop-search-row">
        <div className="sop-search">
          <Icon name="Search" />
          <input
            className="sop-search__input"
            placeholder="Введите ключевые слова..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`sop-filter-btn${hasActiveFilters ? ' sop-filter-btn--active' : ''}`}
          onClick={() => setMobileFilter(true)}
          aria-label="Фильтры"
        >
          <Icon name="Filter" size={20} />
        </button>
      </div>

    <div className="sop-page">
      {/* Left: grid */}
      <div className="sop-page__left">

        <div className="sop-grid-wrap">
          {filtered.length === 0 ? (
            <div className="sop-empty">Предложения не найдены</div>
          ) : (
            <div className="sop-grid">
              {filtered.map(item => (
                <OfferCard
                  key={item.id}
                  offer={item}
                  isFav={favIds.includes(item.id)}
                  onToggleFav={toggleFav}
                  onClick={() => setSelected(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: filters (desktop only) */}
      <div className="sop-page__right">
        <FavFilterPanel
          options={OFFER_DIRECTIONS}
          selected={filters.directions}
          onChange={(dirs) => setFilters({ directions: dirs })}
          showFav={showFav}
          onToggleFav={() => setShowFav(v => !v)}
          onClear={() => { setFilters(EMPTY_FILTERS); setShowFav(false); }}
          clearLabel="Очистить фильтры"
        />
      </div>

      {/* Mobile filter sheet */}
      {mobileFilter && (
        <MobileFilterSheet
          title="Фильтры"
          options={OFFER_DIRECTIONS}
          selected={filters.directions}
          showFav
          favActive={showFav}
          onApply={(dirs, fav) => {
            setFilters({ directions: dirs });
            setShowFav(fav);
          }}
          onClear={() => {
            setFilters(EMPTY_FILTERS);
            setShowFav(false);
          }}
          onClose={() => setMobileFilter(false)}
        />
      )}
    </div>
    </>
  );
}
