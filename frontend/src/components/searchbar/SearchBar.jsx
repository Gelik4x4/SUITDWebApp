import './SearchBar.css';

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function SearchBar({
  value, onChange, placeholder = 'Поиск',
  onBack,       
  showFavorites,
}) {
  return (
    <div className="searchbar">
      {onBack && (
        <button className="searchbar__back icon-btn" onClick={onBack} aria-label="Назад">
          <IconBack />
        </button>
      )}
      <div className="searchbar__field">
        <IconSearch />
        <input
          className="searchbar__input"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      {showFavorites && (
        <button className="searchbar__fav icon-btn" aria-label="Избранное">
          <IconHeart />
        </button>
      )}
    </div>
  );
}
