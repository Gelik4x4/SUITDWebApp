import React, { useState } from 'react';
import './TabData.css';
import ProfileField from './ProfileField';

export default function TabData() {
  const [name,     setName]     = useState('');
  const [surname,  setSurname]  = useState('');
  const [group,    setGroup]    = useState('');
  const [email,    setEmail]    = useState('');

  return (
    <div className="tab-data">
      <div className="tab-data__fields">
        <ProfileField label="Имя"           placeholder="Иван"               value={name}    onChange={setName} />
        <ProfileField label="Фамилия"       placeholder="Алексеев"           value={surname} onChange={setSurname} />
        <ProfileField label="Номер группы"  placeholder="Номер группы"       value={group}   onChange={setGroup} />
        <ProfileField label="Почта"         placeholder="petrovich@gmail.com" value={email}   onChange={setEmail} type="email" />
      </div>

      <div className="tab-data__actions">
        <button className="btn btn--outline">Сменить пароль</button>
        <button className="btn btn--primary">Подтвердить данные</button>
      </div>
    </div>
  );
}
