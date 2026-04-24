import ScheduleWidget from "../components/dashboard/ScheduleWidget"
import OffersWidget from "../components/dashboard/OffersWidget"
import NewsWidget from "../components/dashboard/NewsWidget"
import VacanciesWidget from "../components/dashboard/VacanciesWidget"
import EventsWidget from "../components/dashboard/EventsWidget"

import "../styles/main.css"

function Home() {
  return (
    <div className="grid">

      {/* Левая колонка: расписание + спецпредложения */}
      <div className="grid-col--left">
        <div className="grid-schedule">
          <ScheduleWidget />
        </div>
        <div className="grid-offers">
          <OffersWidget />
        </div>
      </div>

      {/* Центральная колонка: вакансии + новости (верхняя строка) и мероприятия (нижняя строка) */}
      <div className="grid-col--center">
        <div className="top-row">
          <div className="grid-vacancies">
            <VacanciesWidget />
          </div>
          <div className="grid-news">
            <NewsWidget />
          </div>
        </div>
        <div className="grid-events">
          <EventsWidget />
        </div>
      </div>

    </div>
  );
}

export default Home