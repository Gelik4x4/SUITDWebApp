import './VacanciesWidget.css';
import Icon from '@icon/Icon';
import FavButton from './FavButton';

function JobCard({ title, company, img, tag, tagColor = 'purple' }) {
  const hasImg = Boolean(img);

  return (
    <div className="job-card">
      {hasImg && <img src={img} alt={title} className="job-card__bg-img" />}

      {/* Верхняя строка: тег + кнопка избранного */}
      <div className="job-card__top-row">
        {tag && (
          <span className={`badge badge--${tagColor}`}>{tag}</span>
        )}
        <FavButton />
      </div>

      <div className="job-card__content">
        <div className="job-card__title">{title}</div>
        <div className="job-card__company">{company}</div>
      </div>
    </div>
  );
}

const vacancies = [
  {
    title: 'UI/UX Дизайнер',
    company: 'Альфа-банк',
    img: '/src/assets/img/vacancy/vacancy-1.png',
    tag: 'Без опыта',
    tagColor: 'orange',
  },
  {
    title: 'Дизайнер-стажер',
    company: 'Versus.legal',
    img: '/src/assets/img/vacancy/vacancy-2.png',
    tag: 'Без опыта',
    tagColor: 'orange',
  },
  {
    title: 'Моушен-дизайнер',
    company: 'Яндекс Крауд: Контент',
    img: '/src/assets/img/vacancy/vacancy-3.png',
    tag: 'Опыт 1-3 года',
    tagColor: 'blue',
  },
  {
    title: 'Графический дизайнер (маркетплейсы)',
    company: 'WildSpace',
    img: '/src/assets/img/vacancy/vacancy-4.png',
    tag: 'Без опыта',
    tagColor: 'orange',
  },
];

export default function VacanciesWidget() {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Популярные вакансии</span>
        <button className="icon-btn"><Icon name="ArrowUp" /></button>
      </div>
      <div className="vacancies-grid">
        {vacancies.map((v, i) => (
          <JobCard key={i} {...v} />
        ))}
      </div>
    </div>
  );
}
