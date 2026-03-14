import ScheduleWidget from "../components/dashboard/ScheduleWidget"
import InternshipsWidget from "../components/dashboard/InternshipsWidget"
import OffersWidget from "../components/dashboard/OffersWidget"
import NewsWidget from "../components/dashboard/NewsWidget"
import VacanciesWidget from "../components/dashboard/VacanciesWidget"
import EventsWidget from "../components/dashboard/EventsWidget"

import "../styles/main.css"

function Home() {
  return (
    <div className="grid">

      <div className="grid-schedule">
        <ScheduleWidget />
      </div>

      <div className="grid-internships">
        <InternshipsWidget />
      </div>

      <div className="grid-news">
        <NewsWidget />
      </div>

      <div className="grid-offers">
        <OffersWidget />
      </div>

      <div className="grid-vacancies">
        <VacanciesWidget />
      </div>

      <div className="grid-events">
        <EventsWidget />
      </div>

    </div>
  );
}


export default Home
