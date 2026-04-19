import React, { useState, useRef, useEffect } from 'react';
import './GroupSelectorModal.css';
import Icon from '@icon/Icon';

/* ── Данные групп ── */
const GROUPS = [
  '1-МД-1','1-МД-2','1-МД-3','1-МД-4','1-МД-5',
  '2-МД-1','2-МД-2','2-МД-3','2-МД-4','2-МД-5',
  '3-МД-1','3-МД-2','3-МД-3','3-МД-4','3-МД-5',
  '4-МД-1','4-МД-2','4-МД-3','4-МД-4','4-МД-5',
  '1-ИТ-1','1-ИТ-2','2-ИТ-1','2-ИТ-2','3-ИТ-1','3-ИТ-2',
  '1-ДГ-1','1-ДГ-2','2-ДГ-1','2-ДГ-2','3-ДГ-1',
  '1-ДК-1','2-ДК-1','3-ДК-1',
  '1-ЭК-1','2-ЭК-1','3-ЭК-1',
];

/* ── Данные преподавателей (имена) ── */
const TEACHERS = [
  'Дроботун Нина Владимировна',
  'Волков Андрей Игоревич',
  'Волкова Галина Константиновна',
  'Калугина Наталья Ильинична',
  'Князева Ирина Константиновна',
  'Кокорин Евгений Сергеевич',
  'Колмыкова Маргарита Михайловна',
  'Косарева Анастасия Николаевна',
  'Костюк Инна Сергеевна',
  'Лебедева Светлана Викторовна',
  'Медведева Анна Александровна',
  'Моргоева Ирма Юрьевна',
  'Николаева Лали Гочевна',
  'Сухарева Алина Михайловна',
  'Дворко Нина Ивановна',
  'Аврамова Ксения Борисовна',
  'Алатырцева Елизавета Олеговна',
  'Алексеева Анна Сергеевна',
  'Борисова Татьяна Петровна',
  'Викулина Екатерина Андреевна',
  'Гурьев Ярослав Олегович',
  'Епанян Виктория Викторовна',
  'Кузнецова Марина Рудольфовна',
];


export default function GroupSelectorModal({ onClose, onSelectGroup, onSelectTeacher }) {
  const [tab,    setTab]    = useState('groups');   // 'groups' | 'teachers'
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  /* Фокус на поиск при открытии */
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [tab]);

  /* Сбрасываем поиск при смене таба */
  const switchTab = (t) => {
    setTab(t);
    setSearch('');
  };

  const isGroups   = tab === 'groups';
  const items      = isGroups ? GROUPS : TEACHERS;
  const q          = search.toLowerCase();
  const filtered   = q ? items.filter(i => i.toLowerCase().includes(q)) : items;

  const handleSelect = (item) => {
    if (isGroups) onSelectGroup?.(item);
    else          onSelectTeacher?.(item);
    onClose();
  };

  return (
    <div className="gsm-overlay" onClick={onClose}>
      <div className="gsm-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="gsm-header">
          <h2 className="gsm-title">
            {isGroups ? 'Выбор группы' : 'Выбор преподавателя'}
          </h2>
            <button className="cal-close-btn" onClick={onClose}>
              <Icon name="Cross" size={32} />
            </button>
        </div>

        {/* ── Tabs ── */}
        <div className="gsm-tabs">
          <button
            className={`gsm-tab${tab === 'groups' ? ' gsm-tab--active' : ''}`}
            onClick={() => switchTab('groups')}
          >
            Группы
          </button>
          <button
            className={`gsm-tab${tab === 'teachers' ? ' gsm-tab--active' : ''}`}
            onClick={() => switchTab('teachers')}
          >
            Преподаватели
          </button>
        </div>

        {/* ── Search ── */}
        <div className="gsm-search">
          <Icon name="Search"/>
          <input
            ref={inputRef}
            className="gsm-search__input"
            placeholder={isGroups ? 'Введите название группы...' : 'Введите ФИО преподавателя...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── List ── */}
        <div className="gsm-list">
          {filtered.length === 0 ? (
            <div className="gsm-empty">Ничего не найдено</div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={i}
                className="gsm-item"
                onClick={() => handleSelect(item)}
              >
                {item}
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
