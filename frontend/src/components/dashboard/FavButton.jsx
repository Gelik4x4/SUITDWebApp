import Icon from '@icon/Icon';

/*
  Кнопка избранного — 32px круг, иконка 24px.
  Базовые стили (.fav-btn) объявлены в main.css.
  Позиционирование (absolute top/right) задаётся через main.css
  для каждого типа карточки (.event-card .fav-btn и т.д.).
*/
export default function FavButton() {
  return (
    <button className="fav-btn" type="button" aria-label="Добавить в избранное">
      <Icon name="Heart" size={24} />
    </button>
  );
}
