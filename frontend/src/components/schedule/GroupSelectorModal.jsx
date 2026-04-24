import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import './GroupSelectorModal.css';
import Icon from '@icon/Icon';
import { supabase } from '@supabaseClient';

/* ── Fetch groups and teachers from DB ── */
const fetchGroups = async () => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name')
    .order('name', { ascending: true });
  if (error) throw error;
  return data.map(g => g.name);
};

const fetchTeachers = async () => {
  const { data, error } = await supabase
    .from('schedule')
    .select('teacher')
    .not('teacher', 'is', null);
  if (error) throw error;
  /* Уникальные преподаватели, отсортированные */
  const unique = [...new Set(data.map(r => r.teacher).filter(Boolean))].sort();
  return unique;
};

export default function GroupSelectorModal({ onClose, onSelectGroup, onSelectTeacher }) {
  const [tab, setTab] = useState('groups');
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 10 * 60 * 1000,
  });

  const { data: teachers = [], isLoading: loadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [tab]);

  const switchTab = (t) => { setTab(t); setSearch(''); };

  const isGroups = tab === 'groups';
  const items = isGroups ? groups : teachers;
  const loading = isGroups ? loadingGroups : loadingTeachers;
  const q = search.toLowerCase();
  const filtered = q ? items.filter(i => i.toLowerCase().includes(q)) : items;

  const handleSelect = (item) => {
    if (isGroups) onSelectGroup?.(item);
    else onSelectTeacher?.(item);
    onClose();
  };

  return (
    <div className="gsm-overlay" onClick={onClose}>
      <div className="gsm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="gsm-header">
          <h2 className="gsm-title">
            {isGroups ? 'Выбор группы' : 'Выбор преподавателя'}
          </h2>
          <button className="gsm-close" onClick={onClose}>
            <Icon name="Cross" size={24} />
          </button>
        </div>

        {/* Tabs */}
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

        {/* Search */}
        <div className="gsm-search">
          <Icon name="Search" />
          <input
            ref={inputRef}
            className="gsm-search__input"
            placeholder={isGroups ? 'Введите название группы...' : 'Введите ФИО преподавателя...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="gsm-list">
          {loading ? (
            <div className="gsm-empty">Загрузка...</div>
          ) : filtered.length === 0 ? (
            <div className="gsm-empty">Ничего не найдено</div>
          ) : (
            filtered.map((item, i) => (
              <button key={i} className="gsm-item" onClick={() => handleSelect(item)}>
                {item}
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
