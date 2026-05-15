import './ServicesPage.css';
import ServiceCard    from '../components/services/ServiceCard';
import ServiceSection from '../components/services/ServiceSection';

import service1  from '@/assets/img/services/service-1.png';
import service2  from '@/assets/img/services/service-2.png';
import service3  from '@/assets/img/services/service-3.png';
import service4  from '@/assets/img/services/service-4.png';
import service5  from '@/assets/img/services/service-5.png';
import service6  from '@/assets/img/services/service-6.png';
import service7  from '@/assets/img/services/service-7.png';
import service8  from '@/assets/img/services/service-8.png';
import service9  from '@/assets/img/services/service-9.png';
import service10 from '@/assets/img/services/service-10.png';
import service11 from '@/assets/img/services/service-11.png';

function ServicesPage() {
  return (
    <div className="services-page">

      <ServiceSection title="Университет" modifier="university">
        <ServiceCard page="/services/studentcard"   color="blue"   img={service1} />
        <ServiceCard page="/services/news"          color="blue"   img={service2} />
        <ServiceCard page="/services/teachers"      color="blue"   img={service3} />
        <ServiceCard page="/services/events"        color="blue"   img={service4} />
        <ServiceCard page="/services/clubs"         color="blue"   img={service5} />
        <ServiceCard page="/services/askquestion"   color="blue"   img={service6} />
      </ServiceSection>

      <ServiceSection title="Возможности" modifier="opportunities">
        <ServiceCard page="/services/vacancies"     color="orange" img={service7} />
        <ServiceCard page="/services/contests"      color="orange" img={service8} />
        <ServiceCard page="/services/specialoffers" color="orange" img={service9} />
      </ServiceSection>

      <ServiceSection title="Развитие" modifier="development">
        <ServiceCard page="/services/articles"      color="purple" img={service10} />
        <ServiceCard page="/services/podcasts"      color="purple" img={service11} />
      </ServiceSection>

    </div>
  );
}

export default ServicesPage;
