import { useState, useRef, useEffect } from 'react';
import './TabSupport.css';

const IconPaperclip = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const INITIAL_MESSAGES = [
  {
    id: 1, side: 'user',
    text: 'Привет!\nочистить кэш и перезагрузить страницу;\nпроверить фильтры (город, занятость);\nзайти с другого браузера / устройства.\nСкриньот прилагаю.\nМожет быть, она снята с публикации или есть какие-то технические проблемы? Очень хотел бы откликнуться, если она ещё открыта.\nЗаранее спасибо за помощь!',
    time: '16 февраля, 20:10', read: true,
  },
  {
    id: 2, side: 'support',
    text: 'Здравствуйте!\n\nСпасибо за обращение. Чтобы мы могли точнее проверить информацию по вакансии «Дизайнер в агентство ВАК» и помочь вам, уточните, пожалуйста, следующие детали:\n\nС какого именно устройства и в каком браузере вы пытались открыть вакансию?\n\nПриложите, пожалуйста, скриншот того, что вы видите.\n\nКак только получим эти данные, сразу же проверим статус вакансии.\n\nС уважением,\nКоманда поддержки',
    time: '16 февраля, 20:15', read: false,
  },
];

function ChatMessage({ msg }) {
  const isUser = msg.side === 'user';
  return (
    <div className={`chat-msg chat-msg--${msg.side}`}>
      <div className="chat-msg__bubble">
        {msg.text.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
      <div className="chat-msg__meta">
        {msg.time}
        {isUser && (
          <span className={`chat-msg__read${msg.read ? ' chat-msg__read--done' : ''}`}>✓</span>
        )}
      </div>
    </div>
  );
}

export default function TabSupport() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), side: 'user', text, time: 'Сейчас', read: false },
    ]);
    setInput('');
  };

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="tab-support">
      {/* Messages area */}
      <div className="chat-messages">
        {messages.map(m => <ChatMessage key={m.id} msg={m} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <button className="chat-input-bar__attach icon-btn">
          <IconPaperclip />
        </button>
        <input
          className="chat-input-bar__input"
          placeholder="Ваш вопрос..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="chat-input-bar__send icon-btn" onClick={send}>
          <IconSend />
        </button>
      </div>
    </div>
  );
}
