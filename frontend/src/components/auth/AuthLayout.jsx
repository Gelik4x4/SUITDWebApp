import './AuthLayout.css';

export default function AuthLayout({ imageSrc, children }) {
  return (
    <div className="auth-layout">
      {/* Левая часть*/}
      <div className="auth-layout__left">
        <div className="auth-layout__card">
          <img src={imageSrc} alt="auth illustration" className="auth-layout__image" />
        </div>
      </div>

      {/* Правая часть */}
      <div className="auth-layout__right">
        <div className="auth-layout__form-wrap">
          {children}
        </div>
      </div>
    </div>
  );
}