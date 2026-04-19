import './NewsDetail.css';
import Icon from '@icon/Icon';


export default function NewsDetail({ item, onBack }) {
  return (
    <div className="news-detail">
      {/* Title row with back button */}
      <div className="news-detail__titlerow">
        <button className="icon-btn news-detail__back" onClick={onBack}>
          <Icon name="ArrowLeft"/>
        </button>
        <h2 className="news-detail__title">{item.title}</h2>
      </div>

      {/* Article body */}
      <div className="news-detail__article">
        {/* Text paragraphs */}
        <div className="news-detail__text">
          {item.fullText.map((para, i) => (
            <p key={i} className="news-detail__para">{para}</p>
          ))}
        </div>

        {/* Photo below text */}
        {item.image && (
          <div className="news-detail__photo-wrap">
            <img
              src={item.image}
              alt={item.title}
              className="news-detail__photo"
            />
          </div>
        )}
      </div>
    </div>
  );
}
