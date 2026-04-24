import { useState, useRef, useEffect } from 'react';
import './TeacherChat.css';
import Icon from '@icon/Icon';

/* 
  Чат-заглушка — UI готов к подключению через закрытое API личного кабинета.
  Сообщения хранятся в локальном state до подключения бэкенда.
*/

function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(date) {
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  if (date.toDateString() === today.toDateString()) return 'Сегодня';
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export default function TeacherChat({ teacher }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  /* Авто-скролл вниз при новых сообщениях */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), text, from: 'me', time: new Date() }]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  /* Группируем сообщения по датам */
  const grouped = messages.reduce((acc, msg) => {
    const label = formatDateLabel(msg.time);
    if (!acc.length || acc[acc.length-1].label !== label) acc.push({ label, msgs: [] });
    acc[acc.length-1].msgs.push(msg);
    return acc;
  }, []);

  return (
    <div className="tc">
      {/* Header */}
      <div className="tc-header">
        <div className="tc-header__avatar">
          {teacher.photo
            ? <img src={teacher.photo} alt={teacher.name} className="tc-header__photo" />
            : <div className="tc-header__photo-placeholder"><Icon name="User" size={20} /></div>
          }
          <span className="tc-header__online" />
        </div>
        <div className="tc-header__info">
          <div className="tc-header__name">{teacher.name}</div>
          <div className="tc-header__role">Преподаватель</div>
        </div>
      </div>

      <div className="tc-divider" />

      {/* Messages */}
      <div className="tc-messages">
        {messages.length === 0 && (
          <div className="tc-placeholder">
            Напишите преподавателю первым
          </div>
        )}
        {grouped.map(group => (
          <div key={group.label}>
            <div className="tc-date-label">{group.label}</div>
            {group.msgs.map(msg => (
              <div key={msg.id} className={`tc-msg tc-msg--${msg.from}`}>
                {msg.from === 'teacher' && (
                  <div className="tc-msg__avatar">
                    {teacher.photo
                      ? <img src={teacher.photo} alt="" className="tc-msg__photo" />
                      : <div className="tc-msg__photo-placeholder"><Icon name="User" size={14}/></div>
                    }
                  </div>
                )}
                <div className="tc-msg__bubble">
                  <span className="tc-msg__text">{msg.text}</span>
                  <span className="tc-msg__time">{formatTime(msg.time)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="tc-input-row">
        <textarea
          ref={inputRef}
          className="tc-input"
          placeholder="ваш запрос..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className="tc-attach"><Icon name="Attachment" size={24} /></button>
        <button className="tc-send" onClick={send} disabled={!input.trim()}>
          <Icon name="Send" size={24} />
        </button>
      </div>
    </div>
  );
}
