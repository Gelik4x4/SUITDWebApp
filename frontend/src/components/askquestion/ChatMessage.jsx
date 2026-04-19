import Icon from '@icon/Icon';
import './ChatMessage.css';

function ChatMessage({ msg }) {
  const isUser = msg.side === 'user';
  return (
    <div className={`chat-msg chat-msg--${msg.side}`}>
      <div className="chat-msg__bubble">
        {msg.text.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </div>
      <div className="chat-msg__meta">
        {msg.time}
        {isUser && (
          <span className={`chat-msg__tick${msg.read ? ' chat-msg__tick--read' : ''}`}>
            <Icon name="Tick"/>
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
