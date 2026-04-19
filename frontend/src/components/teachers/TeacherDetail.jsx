import './TeacherDetail.css';
import Icon from '@icon/Icon';


export default function TeacherDetail({ teacher, onBack }) {
  return (
    <div className="td">
      {/* Title row */}
      <div className="td__titlerow">
        <button className="icon-btn td__back" onClick={onBack}>
          <Icon name="ArrowLeft"/>
        </button>
        <h2 className="td__name">{teacher.name}</h2>
        <button className="icon-btn">
          <Icon name="Share"/>
        </button>
      </div>

      {/* Body */}
      <div className="td__body">
        {/* Photo */}
        <div className="td__photo-col">
          {teacher.photo
            ? <img src={teacher.photo} alt={teacher.name} className="td__photo" />
            : <AvatarPlaceholder />
          }
        </div>

        {/* Info */}
        <div className="td__info">
          {/* Position */}
          <p className="td__position">{teacher.position}</p>

          {/* Contacts */}
          <div className="td__block">
            <div className="td__block-title">Контактная информация</div>
            <div className="td__contacts">
              <div className="td__contact-row">
                <span className="td__contact-label">E-mail:</span>
                <a href={`mailto:${teacher.email}`} className="td__link">{teacher.email}</a>
              </div>
              <div className="td__contact-row">
                <span className="td__contact-label">Телефон / факс:</span>
                <span>{teacher.phone}</span>
              </div>
              <div className="td__contact-row">
                <span className="td__contact-label">Адрес:</span>
                <span>{teacher.address}</span>
              </div>
            </div>
          </div>

          {/* Reception */}
          <div className="td__block">
            <div className="td__block-title">Часы приёма:</div>
            <div className="td__text">
              {teacher.reception.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="td__block">
            <div className="td__block-title">Образование</div>
            <div className="td__text">
              {teacher.education.map((item, i) => (
                <p key={i} className="td__edu-item">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
