import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react';
import Home from "./pages/Home"
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import SchedulePage from './pages/SchedulePage';
import ServicesPage from './pages/ServicesPage';
import ProfilePage   from './pages/ProfilePage';
import VacanciesPage  from './pages/VacanciesPage';
import ContestsPage   from './pages/ContestsPage';
import NewsPage       from './pages/NewsPage';
import InternshipsPage from './pages/InternshipsPage';
import SpecialOffersPage   from './pages/SpecialOffersPage';
import ArticlesPage        from './pages/ArticlesPage';
import EventsPage          from './pages/EventsPage';
import TeachersPage        from './pages/TeachersPage';
import StudentCardPage     from './pages/StudentCardPage';
import AskQuestionPage     from './pages/AskQuestionPage';
import PodcastsPage        from './pages/PodcastsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main">
          
          <Header />
          <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/home"          element={<Home />} />
          <Route path="/schedule"      element={<SchedulePage />} />
          <Route path="/services"      element={<ServicesPage />} />
          <Route path="/profile"       element={<ProfilePage />} />
          {/* //<Route path={"/vacancies"}   element={<VacanciesPage     onBack={goBack} />} /> */} 
          {/* // {page === 'contests'      && <ContestsPage      onBack={goBack} />} 
          // {page === 'news'          && <NewsPage           onBack={goBack} />}
          // {page === 'internships'   && <InternshipsPage    onBack={goBack} />}
          // {page === 'specialoffers' && <SpecialOffersPage  onBack={goBack} />}
          // {page === 'articles'      && <ArticlesPage       onBack={goBack} />}
          // {page === 'events'        && <EventsPage         onBack={goBack} />}
          // {page === 'teachers'      && <TeachersPage       onBack={goBack} />}
          // {page === 'studentcard'   && <StudentCardPage    onBack={goBack} />}
          // {page === 'askquestion'   && <AskQuestionPage    onBack={goBack} />}
          // {page === 'podcasts'      && <PodcastsPage       onBack={goBack} />} */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
