import './ClubDetail.css';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import Icon from '@icon/Icon';

export default function ClubDetail({ club, onBack }) {
  return (
    <div className="club-detail">
      <Breadcrumbs items={[
        { label: 'Сервисы', onClick: () => window.history.go(-2) },
        { label: 'Клубы',   onClick: onBack },
        { label: 'Информация о клубе' },
      ]} />

      <div className="club-detail__body">

        {/* Left — карточка с фоном */}
        <div className="club-detail__main">
          <div className="club-detail__titlerow">
            <h2 className="club-detail__title">{club.name}</h2>
            {club.website && (
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                title="Открыть сайт"
              >
                <Icon name="Share" />
              </a>
            )}
          </div>

          {club.image && (
            <div className="club-detail__banner">
              <img src={club.image} alt={club.name} className="club-detail__banner-img" />
            </div>
          )}

          {club.description && (
            <p className="club-detail__desc">{club.description}</p>
          )}
        </div>

        {/* Right — sidebar */}
        <aside className="club-detail__meta">
          {club.address && (
            <div className="club-meta-item">
              <Icon name="Location" size={24} />
              <span>{club.address}</span>
            </div>
          )}
          {club.website && (
            <div className="club-meta-item">
              <Icon name="Globe" size={24} />
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className="club-meta-item__link"
              >
                {club.websiteLabel || club.website}
              </a>
            </div>
          )}

          <a
            href={club.website}
            target="_blank"
            rel="noopener noreferrer"
            className="club-detail__cta btn btn--primary"
          >
            Подробнее
          </a>
        </aside>

      </div>
    </div>
  );
}
