import './ServicesPage.css';
import ServiceCard    from '../components/services/ServiceCard';
import ServiceSection from '../components/services/ServiceSection';
import {
  AbstractStudentCard, AbstractNews,      AbstractTeachers,
  AbstractSport,       AbstractEvents,    AbstractQuestion,
  AbstractContests,    AbstractVacancies, AbstractInternships,
  AbstractSpecialOffers, AbstractPodcasts, AbstractArticles,
} from '../components/services/ServiceAbstracts';


export default function ServicesPage({ onNavigate }) {
  return (
    <div className="services-page">
      <ServiceSection title="Университет" modifier="university">
        <ServiceCard label="Студенческий билет" color="orange" Abstract={AbstractStudentCard} onClick={() => onNavigate('studentcard')} />
        <ServiceCard label="Новости"             color="blue"   Abstract={AbstractNews}         onClick={() => onNavigate('news')} />
        <ServiceCard label="Преподаватели"       color="purple" Abstract={AbstractTeachers}     onClick={() => onNavigate('teachers')} />
        <ServiceCard label="Спорт"               color="blue"   Abstract={AbstractSport} />
        <ServiceCard label="События"             color="orange" Abstract={AbstractEvents}       onClick={() => onNavigate('events')} />
        <ServiceCard label="Задать вопрос"       color="yellow" Abstract={AbstractQuestion}     onClick={() => onNavigate('askquestion')} />
      </ServiceSection>
      <ServiceSection title="Возможности" modifier="opportunities">
        <ServiceCard label="Конкурсы"                color="purple" Abstract={AbstractContests}      onClick={() => onNavigate('contests')} />
        <ServiceCard label="Вакансии"                color="teal"   Abstract={AbstractVacancies}     onClick={() => onNavigate('vacancies')} />
        <ServiceCard label="Стажировки"              color="pink"   Abstract={AbstractInternships}   onClick={() => onNavigate('internships')} />
        <ServiceCard label="Специальные предложения" color="blue"   Abstract={AbstractSpecialOffers} onClick={() => onNavigate('specialoffers')} />
      </ServiceSection>
      <ServiceSection title="Развитие" modifier="development">
        <ServiceCard label="Подкасты" color="orange" Abstract={AbstractPodcasts} onClick={() => onNavigate('podcasts')} />
        <ServiceCard label="Статьи"   color="blue"   Abstract={AbstractArticles} onClick={() => onNavigate('articles')} />
      </ServiceSection>
    </div>
  );
}


