import { NavLink } from 'react-router-dom';
import './ServiceCard.css';
import { PAGE_TITLES } from '../../constants/navigation';

export default function ServiceCard({ page, color, img }) {
  return (
    <NavLink
      className={`srv-card srv-card--${color}`}
      to={page}
    >
      {img && (
        <img src={img} alt="" className="srv-card__img" aria-hidden="true" />
      )}
      <span className="srv-card__label">{PAGE_TITLES[page]}</span>
    </NavLink>
  );
}
