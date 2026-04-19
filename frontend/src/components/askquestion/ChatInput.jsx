import { useState } from 'react';
import Icon from '@icon/Icon';
import './ChatInput.css';

function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  return (
    <div className="chat-input">
      <input
        className="chat-input__field"
        placeholder="Ваш вопрос..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
      />
      <button className="icon-btn chat-input__attach">
        <Icon name="Attachment"/>
      </button>
      <button className="icon-btn chat-input__send" onClick={submit}>
        <Icon name="Send"/>
      </button>
    </div>
  );
}

export default ChatInput;
