import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"

import ScheduleWidget from "../components/dashboard/ScheduleWidget"
import InternshipsWidget from "../components/dashboard/InternshipsWidget"
import OffersWidget from "../components/dashboard/OffersWidget"
import NewsWidget from "../components/dashboard/NewsWidget"
import VacanciesWidget from "../components/dashboard/VacanciesWidget"
import EventsWidget from "../components/dashboard/EventsWidget"

// import "../styles/dashboard.css"
import "../styles/main.css"

 function Home() {
  return (
    <div className="layout">
      <Sidebar />

      <main className="main">
        <Header />

        {/* 24-column grid */}
        <div className="grid">

          {/* Row 1 col 1–9: Расписание */}
          <div className="col-9">
            <ScheduleWidget />
          </div>

          {/* Row 1 col 10–18: Стажировки */}
          <div className="col-9">
            <InternshipsWidget />
          </div>

          {/* Col 19–21: Новости — spans rows 1 & 2 */}
          <div className="col-3">
            <NewsWidget />
          </div>

          {/* Row 2 col 1–9: Популярные вакансии */}
          <div className="col-9">
            <VacanciesWidget />
          </div>

          {/* Row 2 col 10–18: Спецпредложения */}
          <div className="col-9">
            <OffersWidget />
          </div>

          {/* Row 3 col 1–18: Мероприятия для вас */}
          <div className="col-18">
            <EventsWidget />
          </div>

        </div>
      </main>
    </div>
  );
}

export default Home
