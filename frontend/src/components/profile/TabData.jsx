import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './TabData.css';
import ProfileField from './ProfileField';
import { supabase } from '@supabaseClient';

const fetchUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select(`
      first_name,
      last_name,
      middle_name,
      email,
      groups (name)
    `)
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Ошибка получения профиля:', error.message);
    return null;
  }

  return data;
};

export default function TabData() {
  const navigate     = useNavigate();
  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn:  fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Локальное состояние для редактируемого email уведомлений
  const [notifEmail,  setNotifEmail]  = useState('');
  const [emailDirty,  setEmailDirty]  = useState(false);

  // TODO: заменить на userProfile.notification_email когда колонка появится в БД
  const initNotifEmail = userProfile?.email ?? '';
  const displayEmail   = emailDirty ? notifEmail : initNotifEmail;

  const handleEmailChange = (val) => {
    setNotifEmail(val);
    setEmailDirty(true);
  };

  const handleEmailCancel = () => {
    setNotifEmail('');
    setEmailDirty(false);
  };

  // TODO: раскомментировать когда в БД появится колонка notification_email
  // const saveEmailMutation = useMutation({
  //   mutationFn: async (newEmail) => {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     const { error } = await supabase
  //       .from('users')
  //       .update({ notification_email: newEmail })
  //       .eq('id', user.id);
  //     if (error) throw error;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['userProfile']);
  //     setEmailDirty(false);
  //   },
  // });

  // Заглушка до появления колонки в БД
  const saveEmailMutation = {
    mutate: () => setEmailDirty(false),
    isLoading: false,
  };

  if (isLoading) return <div>Загрузка профиля...</div>;
  if (error)     return <div style={{ color: 'red' }}>Ошибка: {error.message}</div>;
  if (!userProfile) return <div>Профиль не найден</div>;

  return (
    <div className="tab-data">
      {/* Левая колонка */}
      <div className="tab-data__left">
        <div className="tab-data__fields">
          <ProfileField
            label="Имя"
            placeholder="Иван"
            value={userProfile.first_name ?? ''}
            onChange={() => {}}
            readOnly
          />
          <ProfileField
            label="Фамилия"
            placeholder="Алексеев"
            value={userProfile.last_name ?? ''}
            onChange={() => {}}
            readOnly
          />
          <ProfileField
            label="Отчество"
            placeholder="Петрович"
            value={userProfile.middle_name ?? ''}
            onChange={() => {}}
            readOnly
          />
        </div>

        <button
          className="btn btn--primary tab-data__change-pwd"
          onClick={() => navigate('/change-password')}
        >
          Сменить пароль
        </button>
      </div>

      {/* Правая колонка */}
      <div className="tab-data__right">
        <ProfileField
          label="Доменная почта"
          placeholder="Иван"
          value={userProfile.email ?? ''}
          onChange={() => {}}
          readOnly
        />

        <div className="tab-data__notif-wrap">
          <ProfileField
            label="Email для уведомлений"
            placeholder="Адрес эл. почты"
            type="email"
            value={displayEmail}
            onChange={handleEmailChange}
          />

          {emailDirty && (
            <div className="tab-data__email-actions">
              <button
                className="btn btn--primary"
                onClick={() => saveEmailMutation.mutate(notifEmail)}
                disabled={saveEmailMutation.isLoading}
              >
                Сохранить
              </button>
              <button
                className="btn btn--ghost"
                onClick={handleEmailCancel}
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
