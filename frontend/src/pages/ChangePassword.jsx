import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

import { supabase } from "@supabaseClient";


function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Функция оценки надежности пароля
  const getPasswordStrength = (password) => {
    if (!password) return "";
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return "weak";
    if (score === 3) return "medium";
    return "strong";
  };

  const strength = getPasswordStrength(newPassword);
  const strengthText = {
    weak: "Слабый",
    medium: "Средний",
    strong: "Сильный",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Проверка старого пароля
    if (!oldPassword) {
      setError("Введите текущий пароль");
      return;
    }

    // 2. Валидация нового пароля
    if (newPassword.length < 8) {
      setError("Новый пароль должен быть не менее 8 символов");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Новый пароль и подтверждение не совпадают");
      return;
    }

    setIsLoading(true);

    try {
      // 3. Сначала подтверждаем старый пароль (чтобы убедиться, что пользователь владелец)
      // Получаем email текущего пользователя
      const { data: { user } } = await supabase.auth.getUser();

      // Проверяем старый пароль через повторный вход
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        setError("Неверный текущий пароль");
        setIsLoading(false);
        return;
      }

      // 4. Обновляем пароль
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || "Ошибка при смене пароля");
      } else {
        setSuccess("Пароль успешно изменён");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Автоматически закрыть через 2 секунды (опционально)
        // setTimeout(() => handleClose(), 2000);
      }
    } catch (err) {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setIsLoading(false);
      navigate('/success-change');
    }
  };

  const handleCancel = () => {
    // Закрыть модальное окно (например, вернуться назад или вызвать onClose)
    navigate(-1);
  };

  const handleForgotPassword = () => {
    // Переход на страницу восстановления пароля
    navigate("/reset-password");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <form onSubmit={handleSubmit} className="change-password-card">
          <h2 className="title">Смена пароля</h2>

          <label>Введите старый пароль</label>
          <input
            type="password"
            placeholder="старый пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
          />

          <label>Введите новый пароль</label>
          <input
            type="password"
            placeholder="новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
          />

          {newPassword && (
            <div className={`strength ${strength}`}>
              Надёжность: {strengthText[strength]}
            </div>
          )}
          <p className="hint">
            минимум 8 символов, буквы, цифры, спецсимволы
          </p>

          <label>Повторите новый пароль</label>
          <input
            type="password"
            placeholder="подтвердите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="button-group">
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить пароль"}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel} disabled={isLoading}>
              Отмена
            </button>
          </div>

          <div className="forgot-link">
            <button type="button" onClick={handleForgotPassword} className="link-btn">
              Забыли пароль?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;