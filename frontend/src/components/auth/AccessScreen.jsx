import React, { useState, useRef } from 'react';
import AuthLayout from './AuthLayout';
import './AuthLayout.css';

const IconFile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default function AccessScreen({ onConfirm, onCancel }) {
  const [fullName,  setFullName]  = useState('');
  const [studentId, setStudentId] = useState('');
  const [file,      setFile]      = useState(null);
  const [error,     setError]     = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = () => {
    if (!fullName || !studentId) {
      setError('Заполните все поля'); return;
    }
    if (!file) {
      setError('Прикрепите фото студенческого билета'); return;
    }
    setError('');
    onConfirm({ fullName, studentId, file });
  };

  return (
    <AuthLayout imageSrc="/src/components/img/auth/access.png">     
      <h1 className="auth-title" style={{ fontSize: 'clamp(22px,2.5vw,32px)', marginBottom: 6 }}>
        Откройте все возможности
      </h1>
      <p style={{
        textAlign: 'center', fontSize: 14, color: '#6b7280',
        marginBottom: 'clamp(18px,2.5vh,28px)', lineHeight: 1.55,
      }}>
        Для доступа к полному функционалу приложения<br />
        подтвердите свой статус студента.
      </p>

      <div className="auth-field">
        <label className="auth-field__label">ФИО</label>
        <input
          className="auth-input"
          placeholder="Васильев Иван Андреевич"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label className="auth-field__label">Номер студенческого билета</label>
        <input
          className="auth-input"
          placeholder="22335112"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label className="auth-field__label">Фото студенческого билета</label>
        <div
          className="auth-dropzone"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
          <IconFile />
          {file ? file.name : 'Прикрепить файл'}
        </div>
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
          {error}
        </p>
      )}

      <button className="auth-btn auth-btn--primary" style={{ marginTop: 8 }} onClick={handleSubmit}>
        Подтвердить
      </button>
      <button className="auth-btn auth-btn--ghost" onClick={onCancel}>
        Отмена
      </button>
    </AuthLayout>
  );
}
