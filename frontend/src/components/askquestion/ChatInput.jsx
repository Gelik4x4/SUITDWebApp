import { useState } from 'react';
import Icon from '@icon/Icon';
import './ChatInput.css';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const submit = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText('');
  };

  return (
    <div className="chat-input">
      <input
        className="chat-input__field"
        placeholder="ваш запрос..."
        value={text}
        disabled={disabled}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
      />
      <button className="icon-btn chat-input__attach" disabled={disabled}>
        <Icon name="Paperclip" size={20} />
      </button>
      <button
        className="icon-btn chat-input__send"
        onClick={submit}
        disabled={disabled || !text.trim()}
      >
        <Icon name="Send" size={24} />
      </button>
    </div>
  );
}
