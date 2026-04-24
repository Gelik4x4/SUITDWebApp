import './FavButton.css';
import Icon from '@icon/Icon';

/*
  Кнопка избранного — 32px круг, иконка сердце.
  active: boolean — подсветить красным если в избранном.
*/
export default function FavButton({ active = false, onClick }) {
  return (
    <button
      className={`fav-btn${active ? ' fav-btn--active' : ''}`}
      onClick={onClick}
      type="button"
      aria-label={active ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      <Icon name="Heart" size={24} />
    </button>
  );
}
