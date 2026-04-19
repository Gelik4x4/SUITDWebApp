import { useNavigate } from "react-router-dom"; 
import "./SuccessPopup.css";

function SuccessPopup() {
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate("/profile");
  };
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">Пароль успешно изменен!</h2>
        <img src="/src/assets/img/auth/login.png" alt="Success" className="popup-image" />
        <button className="popup-button" onClick={handleFinish}>
          Хорошо
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;