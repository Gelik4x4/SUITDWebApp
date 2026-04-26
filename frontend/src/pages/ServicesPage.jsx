import './ServicesPage.css';
import ServiceCard    from '../components/services/ServiceCard';
import ServiceSection from '../components/services/ServiceSection';

function ServicesPage() {
  return (
    <div className="services-page">

      <ServiceSection title="Университет" modifier="university">
        <ServiceCard page="/services/studentcard"   color="blue"   img="/src/assets/img/services/service-1.png" />
        <ServiceCard page="/services/news"          color="blue"   img="/src/assets/img/services/service-2.png" />
        <ServiceCard page="/services/teachers"      color="blue"   img="/src/assets/img/services/service-3.png" />
        <ServiceCard page="/services/events"        color="blue"   img="/src/assets/img/services/service-4.png" />
        <ServiceCard page="/services/clubs"         color="blue"   img="/src/assets/img/services/service-5.png" />
        <ServiceCard page="/services/askquestion"   color="blue"   img="/src/assets/img/services/service-6.png" />
      </ServiceSection>

      <ServiceSection title="Возможности" modifier="opportunities">
        <ServiceCard page="/services/vacancies"     color="orange" img="/src/assets/img/services/service-7.png" />
        <ServiceCard page="/services/contests"      color="orange" img="/src/assets/img/services/service-8.png" />
        <ServiceCard page="/services/specialoffers" color="orange" img="/src/assets/img/services/service-9.png" />
      </ServiceSection>

      <ServiceSection title="Развитие" modifier="development">
        <ServiceCard page="/services/articles"      color="purple" img="/src/assets/img/services/service-10.png" />
        <ServiceCard page="/services/podcasts"      color="purple" img="/src/assets/img/services/service-11.png" />
      </ServiceSection>

    </div>
  );
}

export default ServicesPage;
