import { NavLink } from 'react-router-dom';
import './ServiceCard.css';


const pageTitles = {
  '/studentcard': 'Студенческий билет',
  '/news': 'Новости',
  '/teachers': 'Преподаватели',

  '/sport': 'Спорт',
  '/events': 'События',
  '/askquestion': 'Задать вопрос',

  '/contests': 'Конкурсы',
  '/vacancies': 'Вакансии',
  '/internships': 'Стажировки',
  '/specialoffers': 'Специальные предложения',

  '/podcasts': 'Подкасты',
  '/articles': 'Статьи'
};


export default function ServiceCard({ page, color, Abstract, size = 'md' }) {
  return (
    <NavLink
      className={`srv-card srv-card--${color} srv-card--${size}`}
      to={`/services/${page}`}
    >
      {/* Abstract background illustration */}
      {Abstract && (
        <span className="srv-card__art" aria-hidden="true">
          <Abstract />
        </span>
      )}
      <span className="srv-card__label">{pageTitles[page]}</span>
    </NavLink>
  );
}
