import { useState, useRef, useEffect } from 'react';
import './TabSupport.css';
import Icon from '@icon/Icon';

import supportLogo from '@/assets/img/support_logo.png';

const INITIAL_MESSAGES = [];

function DateDivider({ label }) {
  return (
    <div className="chat-date-divider">
      <span className="chat-date-divider__label">{label}</span>
    </div>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.side === 'user';
  const lines  = msg.text.split('\n');

  return (
    <div className={`chat-msg chat-msg--${msg.side}`}>
      {!isUser && (
        <div className="chat-msg__avatar">
          <img src={supportLogo} alt="Поддержка" className="chat-support-logo" />
        </div>
      )}
      <div className="chat-msg__bubble">
        <span className="chat-msg__text">
          {lines.map((line, i) => (
            <span key={i}>{line}{i < lines.length - 1 && <br />}</span>
          ))}
        </span>
        <span className="chat-msg__meta">
          <span className="chat-msg__time">{msg.time}</span>
          {isUser && (
            <span className={`chat-msg__read${msg.read ? ' chat-msg__read--done' : ''}`}>
              <Icon name="Tick" size={14} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default function TabSupport({ onBack }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input,    setInput]    = useState('');
  const bottomRef  = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const now = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), side: 'user', text, time: now(), read: false },
    ]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="tab-support">

      {/* Desktop header */}
      <div className="chat-header">
        <div className="chat-header__avatar">
          <img src={supportLogo} alt="Поддержка" className="chat-support-logo" />
        </div>
        <span className="chat-header__title">Поддержка</span>
      </div>
      <div className="chat-header__divider" />

      {/* Mobile header */}
      <div className="chat-mobile-header">
        <button
          className="chat-mobile-header__back icon-btn"
          onClick={onBack}
          aria-label="Назад"
        >
          <Icon name="ArrowLeft" size={22} />
        </button>
        <span className="chat-mobile-header__title">Поддержка</span>
        <div className="chat-mobile-header__icon" aria-hidden="true">
          <img src={supportLogo} alt="Поддержка" className="chat-support-logo" />
        </div>
      </div>

      {/* Messages area */}
      <div className="chat-messages">
        {!hasMessages && (
          <div className="chat-empty">
            Возникли проблемы? Здесь вы можете задать интересующий вас вопрос
          </div>
        )}
        {hasMessages && (
          <>
            <DateDivider label="Сегодня" />
            {messages.map(m => <ChatMessage key={m.id} msg={m} />)}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          className="chat-input-bar__input"
          placeholder="ваш запрос..."
          value={input}
          rows={1}
          onChange={e => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
          }}
          onKeyDown={onKey}
        />
        <button className="chat-input-bar__attach icon-btn">
          <Icon name="Attachment" />
        </button>
        <button className="chat-input-bar__send icon-btn" onClick={send}>
          <Icon name="Send" />
        </button>
      </div>
    </div>
  );
}
