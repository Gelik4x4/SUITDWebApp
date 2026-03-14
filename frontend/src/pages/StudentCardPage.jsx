import './StudentCardPage.css';
import SearchBar      from '../components/searchbar/SearchBar';
import StudentCardView from '../components/studentcard/StudentCardView';
import { STUDENT_DATA } from '../components/studentcard/StudentCardData';

export default function StudentCardPage({ onBack }) {
  return (
    <div className="scp-page">
      {/* Back button row (как у всех сервисов — в строке поиска) */}
      <div className="scp-page__toprow">
        <SearchBar
          value=""
          onChange={() => {}}
          onBack={onBack}
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
