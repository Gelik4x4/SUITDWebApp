import './ServiceSection.css';

export default function ServiceSection({ title, modifier, children }) {
  return (
    <section className={`srv-section srv-section--${modifier}`}>
      <h2 className="srv-section__title">{title}</h2>
      <div className={`srv-section__grid srv-section__grid--${modifier}`}>
        {children}
      </div>
    </section>
  );
}
