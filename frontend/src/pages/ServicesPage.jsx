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
        {/* Первый ряд элементов */}
        <ServiceCard page="/studentcard"        color="orange" Abstract={AbstractStudentCard} />
        <ServiceCard page="/news"               color="blue"   Abstract={AbstractNews} />
        <ServiceCard page="/teachers"           color="purple" Abstract={AbstractTeachers} />
        {/* Второй ряд элементов  */}
        <ServiceCard page="/sport"              color="blue"   Abstract={AbstractSport} />
        <ServiceCard page="/events"             color="orange" Abstract={AbstractEvents} />
        <ServiceCard page="/askquestion"        color="yellow" Abstract={AbstractQuestion} />
      </ServiceSection>

      <ServiceSection title="Возможности" modifier="opportunities">
        {/* Третий ряд элементов  */}
        <ServiceCard page="/contests"           color="purple" Abstract={AbstractContests} />
        <ServiceCard page="/vacancies"          color="teal"   Abstract={AbstractVacancies} />
        <ServiceCard page="/internships"        color="pink"   Abstract={AbstractInternships} />
        <ServiceCard page="/specialoffers"      color="blue"   Abstract={AbstractSpecialOffers} />
      </ServiceSection>

      <ServiceSection title="Развитие" modifier="development">
        {/* Четвертый ряд элементов */}
        <ServiceCard page="/podcasts" color="orange" Abstract={AbstractPodcasts} />
        <ServiceCard page="/articles"   color="blue"   Abstract={AbstractArticles} />
      </ServiceSection>
    </div>
  );
}


