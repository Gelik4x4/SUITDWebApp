import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navigate } from 'react-router-dom';

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
            <Route path="/"              element={<Navigate to="/home" replace />} />
            <Route path="/home"          element={<Home />} />
            <Route path="/schedule"      element={<SchedulePage />} />
            <Route path="/services"      element={<ServicesPage />} />
            <Route path="/profile"       element={<ProfilePage />} />
            
            <Route path="/services/studentcard"    element={<StudentCardPage />} />
            <Route path="/services/news"           element={<NewsPage />} />
            <Route path="/services/teachers"       element={<TeachersPage />} />

            {/* <Route path="/services/sport"       element={< />} /> */}
            <Route path="/services/events"         element={<EventsPage />} />
            <Route path="/services/askquestion"    element={<AskQuestionPage />} />

            <Route path="/services/contests"       element={<ContestsPage />} />
            <Route path="/services/vacancies"      element={<VacanciesPage />} />
            <Route path="/services/internships"    element={<InternshipsPage />} />
            <Route path="/services/specialoffers"  element={<SpecialOffersPage />} />

            <Route path="/services/podcasts"  element={<PodcastsPage />} />
            <Route path="/services/articles"  element={<ArticlesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
