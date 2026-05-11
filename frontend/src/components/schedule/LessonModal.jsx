import { useState, useEffect } from 'react';
import './LessonModal.css';
import Icon from '@icon/Icon';

/* ─── Helpers ── */

const MONTHS_RU = [
  'января','февраля','марта','апреля','мая','июня',
  'июля','августа','сентября','октября','ноября','декабря',
];

const formatDate = (date) => {
  if (!date) return '';
  return `${date.getDate()} ${MONTHS_RU[date.getMonth()]}`;
};

/* ─── Component ── */

export default function LessonModal({ lesson, date, onClose, onTeacherClick }) {
  const { subject, time, teacher, room, class_type } = lesson;
  const [note, setNote] = useState('');
  const [noteFocused, setNoteFocused] = useState(false);

  /* Закрытие по Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = () => {
    /* TODO: сохранить заметку (например через supabase или localStorage) */
    console.log('Заметка сохранена:', { subject, note });
    onClose();
  };

  const handleCancel = () => {
    setNote('');
    onClose();
  };

  return (
    <div className="lm-overlay" onClick={onClose}>
      <div className="lm-modal" onClick={e => e.stopPropagation()}>

        {/* Мобильный хэдер: стрелка + дата */}
        <div className="lm-mobile-header">
          <button className="lm-mobile-header__back" onClick={onClose} aria-label="Назад">
            <Icon name="ArrowLeft" size={22} />
          </button>
          <span className="lm-mobile-header__date">{formatDate(date)}</span>
        </div>

        {/* Badge — только на мобиле (под хэдером) */}
        {class_type && (
          <span className="lm-badge-mobile">
            <span className={`shed-badge badge--${accentColor(class_type)}`}>{class_type}</span>
          </span>
        )}

        {/* Десктопный хэдер: badge + крестик */}
        <div className="lm-header">
          {class_type && (
            <span className={`shed-badge badge--${accentColor(class_type)}`}>{class_type}</span>
          )}
          <button className="lm-close" onClick={onClose} aria-label="Закрыть">
            <Icon name="Cross" size={24} />
          </button>
        </div>

        {/* Название предмета */}
        <h2 className="lm-title">{subject}</h2>

        {/* Инфо-строки */}
        <div className="lm-info">

          {/* Время */}
          {time && (
            <div className="lm-row">
              <span className="lm-row__icon"><Icon name="Clock" size={20} /></span>
              <span className="lm-row__text">{time}</span>
            </div>
          )}

          {/* Преподаватель */}
          {teacher && (
            <div className="lm-row">
              <span className="lm-row__icon"><Icon name="Teacher" size={20} /></span>
              <button
                className="lm-row__link"
                onClick={() => { onTeacherClick?.(teacher); onClose(); }}
              >
                {teacher}
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          )}

          {/* Аудитория */}
          {room && (
            <div className="lm-row">
              <span className="lm-row__icon"><Icon name="Location" size={20} /></span>
              <span className="lm-row__text">{room}</span>
            </div>
          )}

        </div>

        {/* Заметка */}
        <div className="lm-note">
          <span className="lm-note__icon"><Icon name="Note" size={20} /></span>
          <textarea
            className="lm-note__textarea"
            placeholder="Добавить заметку..."
            value={note}
            onChange={e => setNote(e.target.value)}
          onFocus={() => setNoteFocused(true)}
          onBlur={() => setNoteFocused(note.trim().length > 0)}
          />
        </div>

        {/* Кнопки — появляются при фокусе на заметке */}
        {(noteFocused || note.trim()) && <div className="lm-actions">
          <button className="lm-btn lm-btn--primary" onClick={handleSave}>
            Сохранить запись
          </button>
          <button className="lm-btn lm-btn--secondary" onClick={handleCancel}>
            Отмена
          </button>
        </div>}

      </div>
    </div>
  );
}

/* ─── Local helper (дублируем из LessonCard чтобы не создавать зависимость) ── */
function accentColor(classType) {
  if (!classType) return 'purple';
  const t = classType.toLowerCase();
  if (t === 'пр' || t === 'практика') return 'orange';
  if (t === 'лаб' || t === 'лабораторная') return 'blue';
  return 'purple';
}
