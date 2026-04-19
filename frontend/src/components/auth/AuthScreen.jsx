import './AuthScreen.css';

export default function AuthScreen({ onLogin, onRegister }) {
  return (
    <div className="auth-screen">
      {/* Left */}
      <div className="auth-screen__left">
        <div className="auth-screen__illus-wrap">
          <img 
            src="/src/assets/img/auth/on-boarding-4.png" 
            alt="auth" 
            className="auth-screen__image" 
          />
        </div>
      </div>

      {/* Right */}
      <div className="auth-screen__right">
        <div className="auth-screen__content">
          <h1 className="auth-screen__title">Начнём знакомство?</h1>
          <p className="auth-screen__sub">
            Войдите или зарегистрируйтесь, чтобы получать
            персональные уведомления и доступ ко всем
            возможностям приложения.
          </p>

          <div className="auth-screen__actions">
            <button className="ob-btn ob-btn--primary" onClick={onRegister}>
              Зарегистрироваться
            </button>
            <button className="ob-btn ob-btn--outline" onClick={onLogin}>
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
