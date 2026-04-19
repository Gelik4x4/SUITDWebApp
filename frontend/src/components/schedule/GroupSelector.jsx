import Icon from '@icon/Icon';
import './GroupSelector.css';

function GroupSelector({ group, onClick }) {
  return (
    <button className="group-selector" onClick={onClick}>
      Группа {group} 
      <Icon name="ArrowDown" />
    </button>
  );
}

export default GroupSelector;
