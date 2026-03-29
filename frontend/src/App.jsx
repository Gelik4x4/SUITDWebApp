import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

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
import LoginScreen from "./components/auth/LoginScreen";
import RegisterScreen from "./components/auth/RegisterScreen";
import AccessScreen from "./components/auth/AccessScreen";

// Импорт онбординга
import OnboardingFlow from "./components/onboarding/OnboardingFlow";

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    // опционально: проверяем localStorage, чтобы не показывать онбординг повторно
    return localStorage.getItem("onboarding_done") === "true";
  });

  const handleOnboardingDone = () => {
    localStorage.setItem("onboarding_done", "true");
    setOnboardingComplete(true);
  };

  if (!onboardingComplete) {
    return <OnboardingFlow onDone={handleOnboardingDone} />;
  }

  return (
    <BrowserRouter>
    <Routes>
    <Route
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
    />

    <Route
      path="/register"
      element={
        <RegisterScreen
          onRegister={(data) => {
            localStorage.setItem("token", "123");
            window.location.href = "/home";
          }}
          onGoLogin={() => window.location.href = "/login"}
        />
      }
    />

    {/* <Route
      path="/access"
      element={
        <AccessScreen
          onConfirm={() => {
            localStorage.setItem("onboarded", "true");
            window.location.href = "/home";
          }}
          onCancel={() => window.location.href = "/home"}
        />
      }
    /> */}

    {/* 📱 ОСНОВНОЕ ПРИЛОЖЕНИЕ */}
    <Route
      path="/*"
      element={
        <div className="layout">
          <Sidebar />
          <main className="main">
            <Header />
            <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/services/studentcard" element={<StudentCardPage />} />
            <Route path="/services/news" element={<NewsPage />} />
            <Route path="/services/teachers" element={<TeachersPage />} />
            <Route path="/services/events" element={<EventsPage />} />
            <Route path="/services/askquestion" element={<AskQuestionPage />} />
            <Route path="/services/contests" element={<ContestsPage />} />
            <Route path="/services/vacancies" element={<VacanciesPage />} />
            <Route path="/services/internships" element={<InternshipsPage />} />
            <Route path="/services/specialoffers" element={<SpecialOffersPage />} />
            <Route path="/services/podcasts" element={<PodcastsPage />} />
            <Route path="/services/articles" element={<ArticlesPage />} />
          </Routes>
          </main>
        </div>
      }
    />

  </Routes>
    </BrowserRouter>
  );
}