import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AskQuestionPage.css';
import ChatMessage from '../components/askquestion/ChatMessage';
import ChatInput   from '../components/askquestion/ChatInput';
import Icon from '@icon/Icon';


const INITIAL_MESSAGES = [
  {
    id: 1,
    side: 'bot',
    text: 'Да, мы заботимся об осознанном потреблении и предлагаем переработку.\nКогда вы оформляете заказ, просто поставьте галочку «Отправить оригиналы на переработку».\nМы пришлём вам удобный пакет и адрес, куда их можно отправить.',
    time: '16 февраля, 20:05',
    read: true,
  },
  {
    id: 2,
    side: 'user',
    text: 'Подскажите пожалуйста, как оформить анкету на повышенную стипендию?',
    time: '16 февраля, 20:10',
    read: true,
  },
  {
    id: 3,
    side: 'bot',
    text: 'Сроки подачи анкеты\nДо 10 февраля и до 10 сентября каждого года. Дата может меняться из-за календарного расположения, поэтому необходимо уточнить в деканате.\nВ этом семестре все заполненные анкеты со всеми подписями нужно сдать до 9 февраля в твой деканат (дата может отличаться, поэтому уточни её заранее).\n\nПорядок подачи анкет:\nЗаполнить сводную анкету в электронном виде (самая первая в шаблоне документа).\nСкачать анкету на повышенную государственную академическую стипендию можно на сайте университета.',
    time: '16 февраля, 20:15',
    read: true,
  },
];

/* Авто-ответы бота */
const BOT_REPLIES = [
  'Спасибо за ваш вопрос! Я передам его куратору и вернусь с ответом в ближайшее время.',
  'Уточните, пожалуйста, о каком конкретно вопросе идёт речь? Это поможет мне дать более точный ответ.',
  'Для решения этого вопроса рекомендую обратиться в деканат вашего института.',
  'Согласно регламенту университета, данный вопрос решается через личный кабинет студента на портале.',
];

function formatTime(date) {
  return date.toLocaleString('ru-RU', {
    day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit',
  }).replace(',', ',');
}

export default function AskQuestionPage({ onBack }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [botIdx,   setBotIdx]   = useState(0);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    const now  = new Date();
    const time = formatTime(now);

    const userMsg = {
      id: Date.now(),
      side: 'user',
      text,
      time,
      read: false,
    };

    setMessages(prev => [...prev, userMsg]);

    /* Симуляция ответа бота через 800ms */
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        side: 'bot',
        text: BOT_REPLIES[botIdx % BOT_REPLIES.length],
        time: formatTime(new Date()),
        read: false,
      };
      setMessages(prev => [
        ...prev.map(m => m.id === userMsg.id ? { ...m, read: true } : m),
        botReply,
      ]);
      setBotIdx(i => i + 1);
    }, 800);
  };

  return (
    <div className="aq-page">
      {/* Sub-header: back + subtitle */}
      <div className="aq-page__header">
        <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
          <Icon name="ArrowLeft"/>
        </button>
        <span className="aq-page__subtitle">
          Здесь вы можете задать интересующий вас вопрос
        </span>
      </div>

      {/* Chat area */}
      <div className="aq-page__chat">
        <div className="aq-page__messages">
          {messages.map(msg => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
