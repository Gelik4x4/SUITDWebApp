import { useState, useRef, useEffect } from 'react';
import './TabSupport.css';
import Icon from '@icon/Icon';

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
          <span className={`chat-msg__read${msg.read ? ' chat-msg__read--done' : ''}`}><Icon name="Tick" size={16}/></span>
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
        <input
          className="chat-input-bar__input"
          placeholder="Ваш вопрос..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="chat-input-bar__attach icon-btn">
          <Icon name="Attachment"/>
        </button>
        <button className="chat-input-bar__send icon-btn" onClick={send}>
          <Icon name="Send"/>
        </button>
      </div>
    </div>
  );
}
