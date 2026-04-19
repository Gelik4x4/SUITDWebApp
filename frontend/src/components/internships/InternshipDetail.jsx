import './InternshipDetail.css';
import Icon from '@icon/Icon';


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
          <Icon name="ArrowLeft"/>
        </button>
        <h2 className="intd__title">{item.title} | {item.company}</h2>
        <div className="intd__actions">
          <button className="icon-btn"><Icon name="Share"/></button>
          <button className="icon-btn"><Icon name="Heart"/></button>
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
