import { NavLink } from 'react-router-dom';
import './ServiceCard.css';
import { PAGE_TITLES } from '../../constants/navigation';

export default function ServiceCard({ page, color, Abstract, size = 'md' }) {
  return (
    <NavLink
      className={`srv-card srv-card--${color} srv-card--${size}`}
      to={page}
    >
      {/* Abstract background illustration */}
      {Abstract && (
        <span className="srv-card__art" aria-hidden="true">
          <Abstract />
        </span>
      )}
      <span className="srv-card__label">{PAGE_TITLES[page]}</span>
    </NavLink>
  );
}
