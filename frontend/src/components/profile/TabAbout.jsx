import React from 'react';
import './TabAbout.css';

export default function TabAbout() {
  return (
    <div className="tab-about">

      {/* О сервисе */}
      <h2 className="tab-about__title">О сервисе</h2>
      <p className="tab-about__text">
        Сервис для студентов кафедры цифровых и аддитивных технологий,
        объединяющий учебную информацию, события и возможности в одном месте.
      </p>

      {/* Возможности */}
      <h3 className="tab-about__subtitle">Возможности</h3>
      <ul className="tab-about__list">
        <li>Расписание занятий и преподаватели</li>
        <li>Новости и мероприятия кафедры</li>
        <li>Клубы и внеучебная активность</li>
        <li>Вакансии, конкурсы и стажировки</li>
        <li>Чат с помощником</li>
      </ul>

      {/* Версия */}
      <h3 className="tab-about__subtitle">Версия</h3>
      <p className="tab-about__text">Версия 1.0</p>

      {/* Обратная связь */}
      <h3 className="tab-about__subtitle">Обратная связь</h3>
      <p className="tab-about__text">
        Если вы заметили ошибку или хотите предложить улучшение, напишите нам
        по адресу <a href="mailto:webapp@gmail.com" className="tab-about__link">webapp@gmail.com</a>.
      </p>

    </div>
  );
}
