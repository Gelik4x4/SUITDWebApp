import './SearchBar.css';
import Icon from '@icon/Icon';

export default function SearchBar({
  value, onChange, placeholder = 'Поиск',
  onBack,       
  showFavorites,
}) {
  return (
    <div className="searchbar">
      {onBack && (
        <button className="searchbar__back icon-btn" onClick={onBack} aria-label="Назад">
          <Icon name="ArrowLeft"/>
        </button>
      )}
      <div className="searchbar__field">
        <Icon name="Search"/>
        <input
          className="searchbar__input"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      
    </div>
  );
}
