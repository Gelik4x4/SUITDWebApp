import { useNavigate } from 'react-router-dom';
import './MobilePageHeader.css';
import Icon from '@icon/Icon';

export default function MobilePageHeader({ title, backTo, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="mobile-page-header">
      <button className="mobile-page-header__back" onClick={handleBack} aria-label="Назад">
        <Icon name="ArrowLeft" size={22} />
      </button>
      <span className="mobile-page-header__title">{title}</span>
    </div>
  );
}
