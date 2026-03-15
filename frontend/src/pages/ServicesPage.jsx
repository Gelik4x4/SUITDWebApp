import './ServicesPage.css';
import ServiceCard    from '../components/services/ServiceCard';
import ServiceSection from '../components/services/ServiceSection';
import {
  AbstractStudentCard,   AbstractNews,      AbstractTeachers,
  AbstractSport,         AbstractEvents,    AbstractQuestion,
  AbstractContests,      AbstractVacancies, AbstractInternships,
  AbstractSpecialOffers, AbstractPodcasts,  AbstractArticles,
} from '../components/services/ServiceAbstracts';


function ServicesPage() {
  return (
    <div className="services-page">
      <ServiceSection title="Университет" modifier="university">
        {/* Первый ряд элементов */}
        <ServiceCard page="/services/studentcard"        color="orange" Abstract={AbstractStudentCard} />
        <ServiceCard page="/services/news"               color="blue"   Abstract={AbstractNews} />
        <ServiceCard page="/services/teachers"           color="purple" Abstract={AbstractTeachers} />
        {/* Второй ряд элементов  */}
        <ServiceCard page="/services/sport"              color="blue"   Abstract={AbstractSport} />
        <ServiceCard page="/services/events"             color="orange" Abstract={AbstractEvents} />
        <ServiceCard page="/services/askquestion"        color="yellow" Abstract={AbstractQuestion} />
      </ServiceSection>

      <ServiceSection title="Возможности" modifier="opportunities">
        {/* Третий ряд элементов  */}
        <ServiceCard page="/services/contests"           color="purple" Abstract={AbstractContests} />
        <ServiceCard page="/services/vacancies"          color="teal"   Abstract={AbstractVacancies} />
        <ServiceCard page="/services/internships"        color="pink"   Abstract={AbstractInternships} />
        <ServiceCard page="/services/specialoffers"      color="blue"   Abstract={AbstractSpecialOffers} />
      </ServiceSection>

      <ServiceSection title="Развитие" modifier="development">
        {/* Четвертый ряд элементов */}
        <ServiceCard page="/services/podcasts" color="orange" Abstract={AbstractPodcasts} />
        <ServiceCard page="/services/articles"   color="blue"   Abstract={AbstractArticles} />
      </ServiceSection>
    </div>
  );
}

export default ServicesPage
