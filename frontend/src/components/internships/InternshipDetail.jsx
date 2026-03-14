import './InternshipDetail.css';

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

function Section({ title, items }) {
  return (
    <div className="intd-section">
      <h3 className="intd-section__title">{title}</h3>
      <ul className="intd-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function InternshipDetail({ item, onBack }) {
  return (
    <div className="intd">
      {/* Title row */}
      <div className="intd__titlerow">
        <button className="icon-btn intd__back" onClick={onBack}>
          <IconBack />
        </button>
        <h2 className="intd__title">{item.title} | {item.company}</h2>
        <div className="intd__actions">
          <button className="icon-btn"><IconShare /></button>
          <button className="icon-btn"><IconHeart /></button>
        </div>
      </div>

      {/* Top block */}
      <div className="intd__top">
        <div className="intd__top-left">
          <p className="intd__lead">{item.fullDescription}</p>
          <div className="intd__salary-row">
            <span className="intd__salary">{item.salary}</span>
            <button className="btn btn--primary intd__join">Присоединиться</button>
          </div>
        </div>
        {item.image && (
          <div className="intd__photo-wrap">
            <img src={item.image} alt={item.title} className="intd__photo" />
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="intd__body">
        <Section title="Какие задачи вас ждут"  items={item.tasks} />
        <Section title="Мы ждём, что вы"        items={item.requirements} />
        <Section title="Для работы потребуются" items={item.conditions} />
      </div>
    </div>
  );
}
