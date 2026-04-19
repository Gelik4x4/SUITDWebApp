import { useNavigate } from 'react-router-dom';
import './StudentCardPage.css';
import SearchBar      from '../components/searchbar/SearchBar';
import StudentCardView from '../components/studentcard/StudentCardView';
import { STUDENT_DATA } from '@constants/StudentCardData';
import Icon from '@icon/Icon';

function StudentCardPage() {
  const navigate = useNavigate();
  return (
    <div className="scp-page">
      <button className="icon-btn aq-page__back" onClick={() => navigate('/services')}>
        <Icon name="ArrowLeft"/>
      </button>
      {/* Back button row (как у всех сервисов — в строке поиска) */}
      <div className="scp-page__toprow">
        <SearchBar
          value=""
          onChange={() => {}}
          // onBack={onBack}
          placeholder=""
        />
      </div>

      {/* Card centered */}
      <div className="scp-page__body">
        <StudentCardView data={STUDENT_DATA} />
      </div>
    </div>
  );
}

export default StudentCardPage
