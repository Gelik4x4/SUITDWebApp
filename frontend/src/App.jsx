import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import SchedulePage from "./pages/SchedulePage";
import ServicesPage from "./pages/ServicesPage";
import ProfilePage from "./pages/ProfilePage";
import VacanciesPage from "./pages/VacanciesPage";
import ContestsPage from "./pages/ContestsPage";
import NewsPage from "./pages/NewsPage";
import InternshipsPage from "./pages/InternshipsPage";
import SpecialOffersPage from "./pages/SpecialOffersPage";
import ArticlesPage from "./pages/ArticlesPage";
import EventsPage from "./pages/EventsPage";
import TeachersPage from "./pages/TeachersPage";
import StudentCardPage from "./pages/StudentCardPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import PodcastsPage from "./pages/PodcastsPage";
import ChangePassword from "./pages/ChangePassword";
import SuccessPopup from "./components/auth/SuccessPopup"
import ClubsPage from "./pages/ClubsPage";
import ChatsPage from "./pages/ChatsPage";


// Импорт онбординга
import OnboardingFlow from "./components/onboarding/OnboardingFlow";

import { supabase } from './supabaseClient'; 


export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Состояние загрузки, пока проверяем сессию

  useEffect(() => {
    // 1. Проверяем текущую сессию при первом запуске
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getInitialSession();

    // 2. Слушаем изменения (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Пока база данных отвечает
  if (loading) return <div>Загрузка...</div>;

  // Если сессии нет — показываем экран входа/онбординга
  if (!session) {
    return <OnboardingFlow onDone={() => {}} />; 
  }

  // Если сессия есть — показываем основное приложение
  return (
    <BrowserRouter>
      <Routes>
        {/* Логин, если залогинин (типа перелогин). Нужна ли такая фича?*/}
        {/* <Route
          path="/login"
          element={
            <LoginScreen
              onLogin={(data) => {
                localStorage.setItem("token", "123"); // фейковый логин
                window.location.href = "/home"; // или navigate
              }}
              onGoRegister={() => window.location.href = "/register"}
            />
          }
        /> */}
        <Route
          path="/change-password"
          element={<ChangePassword/>}
        />
        <Route
          path="/success-change"
          element={<SuccessPopup/>}
        />
        <Route
          path="/*"
          element={
            <div className="layout">
              <Sidebar />
              <main className="main">
                <Header />
                <Routes>
                  <Route path="/"                        element={<Navigate to="/home" replace />} />
                  <Route path="/home"                    element={<Home />} />
                  <Route path="/schedule"                element={<SchedulePage />} />
                  <Route path="/services"                element={<ServicesPage />} />
                  <Route path="/profile"                 element={<ProfilePage />} />
                  
                  <Route path="/services/studentcard"    element={<StudentCardPage />} />
                  <Route path="/services/news"           element={<NewsPage />} />
                  <Route path="/services/teachers"       element={<TeachersPage />} />

                  <Route path="/services/clubs"          element={< ClubsPage/>} />
                  <Route path="/services/events"         element={<EventsPage />} />
                  <Route path="/services/askquestion"    element={<AskQuestionPage />} />

                  <Route path="/services/contests"       element={<ContestsPage />} />
                  <Route path="/services/vacancies"      element={<VacanciesPage />} />
                  <Route path="/services/internships"    element={<InternshipsPage />} />
                  <Route path="/services/specialoffers"  element={<SpecialOffersPage />} />

                  <Route path="/services/podcasts"       element={<PodcastsPage />} />
                  <Route path="/services/articles"       element={<ArticlesPage />} />
                  <Route path="/chats"                   element={<ChatsPage />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}