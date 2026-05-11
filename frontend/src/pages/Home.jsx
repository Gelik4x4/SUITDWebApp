import ScheduleWidget from "../components/dashboard/ScheduleWidget"
import OffersWidget from "../components/dashboard/OffersWidget"
import NewsWidget from "../components/dashboard/NewsWidget"
import VacanciesWidget from "../components/dashboard/VacanciesWidget"
import EventsWidget from "../components/dashboard/EventsWidget"

import "../styles/main.css"

function Home() {
  return (
    <>
      {/* ── Desktop layout ── */}
      <div className="grid home-desktop">

        <div className="grid-col--left">
          <div className="grid-schedule">
            <ScheduleWidget />
          </div>
          <div className="grid-offers">
            <OffersWidget />
          </div>
        </div>

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

      {/* ── Mobile layout: плоский порядок ── */}
      <div className="home-mobile">
        <div className="home-mobile__news">
          <NewsWidget />
        </div>
        <div className="home-mobile__schedule">
          <ScheduleWidget />
        </div>
        <div className="home-mobile__events">
          <EventsWidget />
        </div>
        <div className="home-mobile__offer-a">
          <OffersWidget index={0} />
        </div>
        <div className="home-mobile__vacancies">
          <VacanciesWidget />
        </div>
        <div className="home-mobile__offer-b">
          <OffersWidget index={1} />
        </div>
      </div>
    </>
  );
}

export default Home
