import './ChatMessage.css';

function BotAvatar() {
  return (
    <div className="chat-msg__bot-avatar">
      <img
        src="/src/assets/img/bot-avatar.png"
        alt=""
        className="chat-msg__bot-photo"
        onError={e => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    </div>
  );
}

export default function ChatMessage({ msg }) {
  const isUser = msg.side === 'user';
  return (
    <div className={`chat-msg chat-msg--${msg.side}`}>
      {!isUser && <BotAvatar />}
      <div className="chat-msg__content">
        <div className="chat-msg__bubble">
          {msg.text.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </div>
        <div className="chat-msg__time">{msg.time}</div>
      </div>
    </div>
  );
}
