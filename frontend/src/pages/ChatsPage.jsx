import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './ChatsPage.css';
import Icon from '@icon/Icon';
import { CONTACTS as CONTACTS_DATA } from '@constants/chatsData';
import { PAGE_TITLES } from '@constants/navigation';

/* ── Helpers ────────────────────────────────────────────────────── */
function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function Avatar({ src, name, size = 44 }) {
  return src
    ? <img src={src} alt={name} className="ch-avatar" style={{ width: size, height: size }} />
    : <div className="ch-avatar ch-avatar--fallback" style={{ width: size, height: size }}><Icon name="Profile" size={22}/></div>;
}

/* ── Contact list item ──────────────────────────────────────────── */
function ContactItem({ contact, active, onClick }) {
  return (
    <div className={`ch-contact${active ? ' ch-contact--active' : ''}`} onClick={onClick}>
      <Avatar src={contact.avatar} name={contact.name} />
      <div className="ch-contact__info">
        <div className="ch-contact__top">
          <span className="ch-contact__name">{contact.name}</span>
          <span className="ch-contact__time">{contact.time}</span>
        </div>
        <div className="ch-contact__bottom">
          <span className="ch-contact__last">{contact.lastMsg}</span>
          {contact.unread > 0 && (
            <span className="ch-contact__badge">{contact.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Date divider ───────────────────────────────────────────────── */
function DateDivider({ label }) {
  return (
    <div className="ch-date-divider">
      <span className="ch-date-divider__label">{label}</span>
    </div>
  );
}

/* ── Single message ─────────────────────────────────────────────── */
function Message({ msg, contactAvatar, contactName }) {
  const isUser = msg.side === 'user';
  return (
    <div className={`ch-msg ch-msg--${msg.side}`}>
      {!isUser && <Avatar src={contactAvatar} name={contactName} size={36} />}
      <div className="ch-msg__bubble">
        <span className="ch-msg__text">{msg.text}</span>
        <span className="ch-msg__meta">
          <span className="ch-msg__time">{msg.time}</span>
          {isUser && (
            <span className={`ch-msg__read${msg.read ? ' ch-msg__read--done' : ''}`}>
              <Icon name="Tick" size={14}/>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/* ── Chat panel ─────────────────────────────────────────────────── */
function ChatPanel({ contact, messages, onSend, onBack }) {
  const [input, setInput]       = useState('');
  const [showDown, setShowDown] = useState(false);
  const scrollRef   = useRef(null);
  const textareaRef = useRef(null);
  const bottomRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contact.id]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowDown(fromBottom > 120);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const send = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setTimeout(scrollToBottom, 50);
  };

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const grouped = [];
  let lastDate = null;
  messages.forEach(m => {
    if (m.date !== lastDate) {
      grouped.push({ type: 'divider', label: m.date, id: 'd-' + m.date });
      lastDate = m.date;
    }
    grouped.push({ type: 'msg', ...m });
  });

  return (
    <div className="ch-panel">
      <div className="ch-panel__header">
        {/* Mobile: back button */}
        <button className="ch-panel__header-back icon-btn" onClick={onBack} aria-label="Назад">
          <Icon name="ArrowLeft" size={22}/>
        </button>

        {/* Desktop: avatar + info */}
        <div className="ch-panel__header-desktop">
          <Avatar src={contact.avatar} name={contact.name} size={44} />
          <div className="ch-panel__header-info">
            <span className="ch-panel__header-name">{contact.name}</span>
            <span className="ch-panel__header-sub">
              {contact.online
                ? <><span className="ch-panel__online-dot"/>Онлайн</>
                : contact.role
              }
            </span>
          </div>
        </div>

        {/* Mobile: centered name + avatar right */}
        <div className="ch-panel__header-center">
          <span className="ch-panel__header-name">{contact.name}</span>
          <span className="ch-panel__header-sub">
            {contact.online
              ? <><span className="ch-panel__online-dot"/>Онлайн</>
              : contact.role
            }
          </span>
        </div>
        <div className="ch-panel__header-avatar-right">
          <Avatar src={contact.avatar} name={contact.name} size={36} />
        </div>
      </div>

      <div className="ch-panel__divider"/>

      {/* Messages */}
      <div className="ch-panel__messages" ref={scrollRef}>
        {grouped.map(item =>
          item.type === 'divider'
            ? <DateDivider key={item.id} label={item.label} />
            : <Message key={item.id} msg={item} contactAvatar={contact.avatar} contactName={contact.name} />
        )}
        <div ref={bottomRef} />
      </div>

      {showDown && (
        <button className="ch-scroll-down" onClick={scrollToBottom} aria-label="Вниз">
          <Icon name="ArrowDown" size={20}/>
        </button>
      )}

      {/* Input */}
      <div className="ch-panel__input-bar">
        <textarea
          ref={textareaRef}
          className="ch-panel__input"
          placeholder="ваш запрос..."
          rows={1}
          value={input}
          onChange={e => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
          }}
          onKeyDown={onKey}
        />
        <button className="ch-panel__attach icon-btn"><Icon name="Attachment"/></button>
        <button className="ch-panel__send icon-btn" onClick={send}><Icon name="Send"/></button>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function ChatsPage() {
  const { pathname } = useLocation();
  const [contacts, setContacts] = useState(CONTACTS_DATA);
  const [activeId, setActiveId] = useState(() => window.innerWidth > 480 ? 1 : null);
  const [search,   setSearch]   = useState('');
  const [searching, setSearching] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  // На мобиле скрываем таббар когда открыт чат
  useEffect(() => {
    if (activeId !== null) {
      document.body.classList.add('hide-tabbar');
    } else {
      document.body.classList.remove('hide-tabbar');
    }
    return () => document.body.classList.remove('hide-tabbar');
  }, [activeId]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const active = contacts.find(c => c.id === activeId);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (text) => {
    setContacts(prev => prev.map(c => {
      if (c.id !== activeId) return c;
      return {
        ...c,
        lastMsg: text,
        time: nowTime(),
        messages: [
          ...c.messages,
          { id: Date.now(), side: 'user', text, time: nowTime(), date: 'Сегодня', read: false },
        ],
      };
    }));
  };

  const handleContactClick = (id) => {
    setActiveId(id);
    setSearching(false);
  };

  /* ── Render both panels, CSS controls visibility ── */
  return (
    <div className={`chats-page${activeId !== null ? ' chats-page--chat-open' : ''}`}>
      {/* Left panel */}
      <div className="chats-page__left">

        {/* Desktop search */}
        <div className="ch-search-desktop">
          <Icon name="Search" size={24}/>
          <input
            placeholder="Найти сотрудника или чат"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Mobile list header — same structure as global topbar */}
        <div className="ch-list-mobile-header">
          <h1 className="ch-list-mobile-header__title">{PAGE_TITLES[pathname] ?? 'Чаты'}</h1>
          <div className="ch-list-mobile-header__actions">
            <button
              className={`icon-btn${isDark ? ' icon-btn--active' : ''}`}
              onClick={() => setIsDark(prev => !prev)}
              aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
            >
              <Icon name={isDark ? 'Sun' : 'Moon'} size={22}/>
            </button>
            <button className="icon-btn" aria-label="Уведомления">
              <Icon name="Bell" size={22}/>
            </button>
          </div>
        </div>

        {/* Mobile: search row with cancel */}
        <div className="ch-search-row">
          <div className="ch-search">
            <Icon name="Search" size={24}/>
            <input
              className="ch-search__input"
              placeholder="Введите ФИО преподавателя..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSearching(true); }}
              onFocus={() => setSearching(true)}
            />
            {search.length > 0 && (
              <button className="ch-search__clear icon-btn" onClick={() => setSearch('')}>
                <Icon name="Cross" size={16}/>
              </button>
            )}
          </div>
          {searching && (
            <button
              className="ch-search__cancel"
              onClick={() => { setSearch(''); setSearching(false); }}
            >
              Отменить
            </button>
          )}
        </div>

        {/* Contact list */}
        <div className="ch-contacts">
          {filtered.map(c => (
            <ContactItem
              key={c.id}
              contact={c}
              active={c.id === activeId}
              onClick={() => handleContactClick(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Right panel: always shown on desktop, shown on mobile when chat open */}
      {active && (
        <ChatPanel
          key={active.id}
          contact={active}
          messages={active.messages}
          onSend={handleSend}
          onBack={() => setActiveId(null)}
        />
      )}
    </div>
  );
}
