import './Header.css';
import { useLocation } from 'react-router-dom';
import { IconMoon, IconBell } from '../icons/Icons';

const PAGE_TITLES = {
  '/home': 'Доброе утро!', 
  '/schedule': 'Расписание', 
  '/services': 'Сервисы',
  '/profile': 'Профиль', 
  '/vacancies': 'Вакансии', 
  '/contests': 'Конкурсы',
  '/news': 'Новости', 
  '/internships': 'Стажировки', 
  '/specialoffers': 'Специальные предложения',
  '/articles': 'Статьи', 
  '/events': 'Мероприятия', 
  '/teachers': 'Преподаватели',
  '/studentcard': 'Студенческий билет', 
  '/askquestion': 'Задать вопрос', 
  '/podcasts': 'Подкасты',
};

export default function Header() {
  const location = useLocation();
  const activePage = location.pathname  
  return (
    <header className="topbar">
      <h1 className="topbar__greeting">{PAGE_TITLES[activePage] ?? 'SUITD'}</h1>
      <div className="topbar__actions">
        <button className="icon-btn"><IconMoon /></button>
        <button className="icon-btn"><IconBell /></button>
      </div>
    </header>
  );
}
