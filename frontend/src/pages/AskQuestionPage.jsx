import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AskQuestionPage.css';
import ChatMessage from '../components/askquestion/ChatMessage';
import ChatInput   from '../components/askquestion/ChatInput';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';

import botAvatar from '@/assets/img/bot-avatar.png';

/* ─── Системный промпт ────────────────────────────────────────── */
const SYSTEM_PROMPT = `Ты — ЦАТ Помощник, чат-бот студенческого портала СПбГУПТД.
Отвечай кратко, дружелюбно и по делу. Пиши только на русском языке.

База знаний:

СТИПЕНДИИ:
- Академическая стипендия назначается при отсутствии троек по итогам сессии
- Повышенная государственная академическая стипендия (ПГАС):
  * Анкеты подаются дважды в год: до 10 февраля и до 10 сентября (даты уточнять в деканате)
  * Нужно заполнить сводную анкету в электронном виде (шаблон на сайте sutd.ru)
  * Распечатать, собрать подписи и сдать в деканат своего института
  * Критерии: успехи в учёбе, науке, культуре, спорте, общественной деятельности

РАСПИСАНИЕ:
- Расписание доступно в личном кабинете на портале sutd.ru
- Изменения в расписании публикуются в официальных группах ВКонтакте
- По вопросам замен обращаться в деканат

ОБЩЕЖИТИЕ:
- Заявки на общежитие подаются в начале учебного года через деканат
- Студенческий городок: ул. Малая Посадская, 26
- По вопросам: студенческий отдел, каб. 107

СЕССИЯ И УЧЁБА:
- Пересдача: не более двух раз по каждому предмету
- Академический отпуск: заявление в деканат + медицинская справка (при необходимости)
- Перевод между группами: заявление в деканат

ДОКУМЕНТЫ:
- Справка об обучении: через деканат или МФЦ университета
- Военный билет / отсрочка: отдел военно-учётного стола, каб. 210
- Социальная стипендия: отдел социальной работы

КОНТАКТЫ:
- Официальный сайт: sutd.ru
- Адрес: Большая Морская ул., 18, Санкт-Петербург
- Деканат ИИТА: каб. 315
- По всем прочим вопросам рекомендуй обратиться в деканат или на sutd.ru`;

/* ─── API через Vite-прокси (обход CORS) ─────────────────────── */
async function askClaude(history) {
  const messages = history
    .filter(m => m.id !== 1)
    .map(m => ({
      role: m.side === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

  const res = await fetch('/anthropic-proxy/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? 'Не смог сформировать ответ.';
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGES = [{
  id: 1, side: 'bot',
  text: 'Здравствуйте! Я – ЦАТ Помощник.\nПомогу с вопросами по учебе и жизни в университете.\nЧем могу помочь?',
  time: formatTime(new Date()),
}];

/* ─── Page ────────────────────────────────────────────────────── */
export default function AskQuestionPage() {
  const navigate = useNavigate();
  const [messages,  setMessages]  = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('hide-tabbar');
    return () => document.body.classList.remove('hide-tabbar');
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const userMsg = { id: Date.now(), side: 'user', text, time: formatTime(new Date()) };
    const withUser = [...messages, userMsg];
    setMessages(withUser);
    setIsLoading(true);
    try {
      const reply = await askClaude(withUser);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, side: 'bot', text: reply, time: formatTime(new Date()),
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, side: 'bot',
        text: 'Произошла ошибка соединения. Проверьте настройки VITE_ANTHROPIC_API_KEY и перезапустите dev-сервер.',
        time: formatTime(new Date()),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="aq-page">
      {/* Мобильный хэдер */}
      <div className="aq-page__mobile-header">
        <button className="aq-page__mobile-back" onClick={() => navigate('/services')} aria-label="Назад">
          <Icon name="ArrowLeft" size={22} />
        </button>
        <div className="aq-page__mobile-header__center">
          <span className="aq-page__mobile-title">ЦАТ Помощник</span>
          <span className="aq-page__mobile-status">
            <span className="aq-page__online-dot" />
            Онлайн 24/7
          </span>
        </div>
        <div className="aq-page__bot-avatar aq-page__mobile-avatar">
          <img
            src={botAvatar}
            alt="ЦАТ Помощник"
            className="aq-page__bot-photo"
            onError={e => { e.target.style.display='none'; }}
          />
        </div>
      </div>

      {/* Десктопные breadcrumbs */}
      <div className="aq-page__breadcrumbs">
        <Breadcrumbs items={[
          { label: 'Сервисы', onClick: () => navigate('/services') },
          { label: 'Чат с помощником' },
        ]} />
      </div>

      <div className="aq-page__chat">
        {/* Bot header — только десктоп */}
        <div className="aq-page__bot-header">
          <div className="aq-page__bot-avatar">
            <img
              src={botAvatar}
              alt="ЦАТ Помощник"
              className="aq-page__bot-photo"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
          </div>
          <div className="aq-page__bot-info">
            <div className="aq-page__bot-name">ЦАТ Помощник</div>
            <div className="aq-page__bot-status">
              <span className="aq-page__online-dot" />
              Онлайн 24/7
            </div>
          </div>
        </div>
        <div className="aq-page__divider" />

        {/* Messages */}
        <div className="aq-page__messages">
          <div className="aq-page__date-label">Сегодня</div>
          {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
          {isLoading && (
            <div className="aq-page__typing">
              <div className="aq-page__typing-dot" />
              <div className="aq-page__typing-dot" />
              <div className="aq-page__typing-dot" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
