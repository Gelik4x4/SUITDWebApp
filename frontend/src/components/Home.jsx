import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ScheduleWidget    from '../widgets/ScheduleWidget';
import InternshipsWidget from '../widgets/InternshipsWidget';
import VacanciesWidget   from '../widgets/VacanciesWidget';
import OffersWidget      from '../widgets/OffersWidget';
import NewsWidget        from '../widgets/NewsWidget';
import EventsWidget      from '../widgets/EventsWidget';

export default function Home() {
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
